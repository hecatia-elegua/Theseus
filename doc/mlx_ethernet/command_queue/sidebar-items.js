window.SIDEBAR_ITEMS = {"enum":[["AccessRegisterOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::AccessRegister`]."],["CmdState","The possible states a command can be in as it is updated by the driver and then posted to the HCA"],["CommandDeliveryStatus","Return codes written by HW in the delivery status field of the command entry. See [`CommandQueueEntry::token_signature_status_own`]."],["CommandOpcode","Command opcode written by SW in opcode field of the input data in the command entry. See [`CommandQueueEntry::command_input_opcode`]."],["CommandQueueError","Possible reasons for failure when executing a command"],["CommandReturnStatus","Command status written by HW in status field of the output data in the command entry. See [`CommandQueueEntry::command_output_status`]."],["CommandTransportType","Type of transport that carries the command."],["HcaPortType","Possible values of the port type field returned when retrieving device capabilities using the command [`CommandOpcode::QueryHcaCap`]."],["ManagePagesOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::ManagePages`]."],["QueryHcaCapCurrentOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::QueryHcaCap`] and we want to retrieve current values of capabilities."],["QueryHcaCapMaxOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::QueryHcaCap`] and we want to retrieve maximum values of capabilities."],["QueryPagesOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::QueryPages`]."],["QueryVportStateOpMod","Possible values of the opcode modifer when the opcode is [`CommandOpcode::QueryVportState`]."]],"struct":[["Command","A struct representing a Command Queue Entry in the Command Queue buffer currently in use by the driver."],["CommandBuilder","Struct that makes it easier to pass the variety of arguments that are required for different commands"],["CommandCompletionStatus",""],["CommandQueue","A buffer of fixed-size entries that is used to pass commands to the HCA. It resides in a physically contiguous 4 KiB memory chunk. (Section 8.24.1: HCA Command Queue)"],["CommandQueueEntry","Layout of a command passed to the NIC. The fields include control information for the command as well as actual command input and output. The first 16 bytes of the actual command input are part of the entry. The remaining data is written in mailboxes. Similarly, the first 16 bytes of the command output are part of the entry and remaining data is written in mailboxes."],["HCACapabilities","The HCA capabilities are stored in this struct after being extracted from [`HCACapabilitiesLayout`]"]]};