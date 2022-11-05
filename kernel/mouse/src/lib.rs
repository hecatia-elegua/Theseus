//! A basic driver for a mouse connected to the legacy PS/2 port.

#![no_std]
#![feature(abi_x86_interrupt)]

use log::{error, warn, debug};
use spin::Once;
use mpmc::Queue;
use event_types::Event;
use x86_64::structures::idt::InterruptStackFrame;
use mouse_data::{MouseButtons, MouseEvent, MouseMovementRelative};
use ps2::{mouse_id, init_ps2_port2, set_mouse_id, test_ps2_port2, read_mouse_packet, MousePacketBits4, MouseId};

/// The first PS/2 port for the mouse is connected directly to IRQ 0xC.
/// Because we perform the typical PIC remapping, the remapped IRQ vector number is 0x2C.
const PS2_MOUSE_IRQ: u8 = interrupts::IRQ_BASE_OFFSET + 0xC;

static MOUSE_PRODUCER: Once<Queue<Event>> = Once::new();

/// Initialize the PS/2 mouse driver and register its interrupt handler.
/// 
/// ## Arguments
/// * `mouse_queue_producer`: the queue onto which the mouse interrupt handler
///    will push new mouse events when a mouse action occurs.
pub fn init(mouse_queue_producer: Queue<Event>) -> Result<(), &'static str> {
    // Init the second PS/2 port, which is used for the mouse.
    init_ps2_port2();
    // Test the second port.
    test_ps2_port2()?;

    //TODO: set to 3, failed? id = 0, otherwise set to 4, failed? id = 3, otherwise id = 4
    //the current code beneath just tries to set id = 4, so is not final
    // Set Mouse ID to 4.
    if let Err(e) = set_mouse_id(MouseId::Four) {
        error!("Failed to set the mouse id to four: {e}");
        return Err("Failed to set the mouse id to four");
    }
    // Read it back to check that it worked.
    match mouse_id() {
        Ok(id) =>  {
            debug!("The PS/2 mouse ID is: {id:?}");
            if !matches!(id, MouseId::Four) {
                error!("Failed to set the mouse id to four");
                return Err("Failed to set the mouse id to four");
            }
        }
        Err(e) => {
            error!("Failed to read the PS/2 mouse ID: {e}");
            return Err("Failed to read the PS/2 mouse ID");
        }
    }

    // Register the interrupt handler
    interrupts::register_interrupt(PS2_MOUSE_IRQ, ps2_mouse_handler).map_err(|e| {
        error!("PS/2 mouse IRQ {PS2_MOUSE_IRQ:#X} was already in use by handler {e:#X}! Sharing IRQs is currently unsupported.");
        "PS/2 mouse IRQ was already in use! Sharing IRQs is currently unsupported."
    })?;

    // Final step: set the producer end of the mouse event queue.
    MOUSE_PRODUCER.call_once(|| mouse_queue_producer);
    Ok(())
}

/// The interrupt handler for a PS/2-connected mouse, registered at IRQ 0x2C.
extern "x86-interrupt" fn ps2_mouse_handler(_stack_frame: InterruptStackFrame) {
    let mouse_packet = read_mouse_packet();
    if mouse_packet.x_overflow() || mouse_packet.y_overflow() {
        //NOTE: overflow should maybe just be handled by using the max value on overflow, though it's apparently impossible to trigger it
        //and often the hardware clamps it anyways (https://forum.osdev.org/viewtopic.php?f=1&t=31176)
        error!("The overflow bits in the mouse data packet's first byte are set! Discarding the whole packet.");
    } else if mouse_packet.always_one() != 1 {
        // it's very likely that the PS/2 controller send us an [interrupt](https://wiki.osdev.org/%228042%22_PS/2_Controller#Interrupts),
        // if it did, the whole 32 bits of the mouse_packet are zero (at least on my end)
        // checking the PS/2 controller status register's mouse_output_buffer_full might work, but this current solution does also work
        // error!("Third bit in the mouse data packet's first byte should always be 1. Discarding the whole packet since the bit is 0.");
    } else if let Err(e) = handle_mouse_input(mouse_packet) {
        error!("ps2_mouse_handler: {e:?}");
    }

    interrupts::eoi(Some(PS2_MOUSE_IRQ));
}


/// enqueue a Mouse Event according to the data
fn handle_mouse_input(mouse_packet: MousePacketBits4) -> Result<(), &'static str> {
    let buttons = Buttons::from(&mouse_packet).0;
    let movement = Movement::from(&mouse_packet).0;

    let mouse_event = MouseEvent::new(buttons, movement);
    let event = Event::MouseMovementEvent(mouse_event);

    if let Some(producer) = MOUSE_PRODUCER.get() {
        producer.push(event).map_err(|_| "failed to enqueue the mouse event")
    } else {
        warn!("MOUSE_PRODUCER wasn't yet initialized, dropping mouse event {event:?}.");
        Err("MOUSE_PRODUCER wasn't yet initialized")
    }
}

// both MouseMovementRelative and MousePacketBits4 are in different crates, so we need a newtype wrapper:
struct Movement(MouseMovementRelative);
impl From<&MousePacketBits4> for Movement {
    fn from(mouse_packet: &MousePacketBits4) -> Self {
        Self(MouseMovementRelative::new(
            mouse_packet.x_movement(),
            mouse_packet.y_movement(),
            mouse_packet.scroll_movement()
        ))
    }
}

// both MouseButtons and MousePacketBits4 are in different crates, so we need a newtype wrapper:
struct Buttons(MouseButtons);
impl From<&MousePacketBits4> for Buttons {
    fn from(mouse_packet: &MousePacketBits4) -> Self {
        Self(MouseButtons::new(
            mouse_packet.button_left(),
            mouse_packet.button_right(),
            mouse_packet.button_middle(),
            mouse_packet.button_4(),
            mouse_packet.button_5(),
        ))
    }
}
