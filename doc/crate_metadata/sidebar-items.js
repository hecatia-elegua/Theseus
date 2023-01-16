window.SIDEBAR_ITEMS = {"constant":[["BSS_SECTION_NAME",""],["CRATE_HASH_DELIMITER","A crate’s name and its hash are separated by “-”, i.e., “my_crate-hash”."],["DATA_BSS_SECTION_FLAGS","`.data` and `.bss` sections are read-write and non-executable."],["DATA_SECTION_NAME",""],["EH_FRAME_SECTION_NAME",""],["GCC_EXCEPT_TABLE_SECTION_NAME",""],["MODULE_PREFIX_DELIMITER","The Theseus Makefile appends prefixes onto bootloader module names, which are separated by the “#” character.  For example, “k#my_crate-hash.o”."],["RODATA_SECTION_FLAGS","`.rodata` sections are read-only and non-executable."],["RODATA_SECTION_NAME",""],["SECTION_HASH_DELIMITER","A section’s demangled name and its hash are separated by “::h”,  e.g., `\"my_crate::section_name::h<hash>\"`."],["TEXT_SECTION_FLAGS","`.text` sections are read-only and executable."],["TEXT_SECTION_NAME",""],["TLS_BSS_SECTION_NAME",""],["TLS_DATA_SECTION_NAME",""]],"enum":[["CrateType","The type of a crate, based on its object file naming convention. This naming convention is only used for crate object files that come from bootloader-provided modules, which the Theseus makefile assigns at build time."],["SectionType","The possible types of sections that can be loaded from a crate object file."]],"fn":[["section_name_str_ref","Returns the default name for the given `SectionType` as a [`StrRef`]."],["write_relocation","Actually write the value of a relocation entry."]],"struct":[["LoadedCrate","Represents a single crate whose object file has been  loaded and linked into at least one `CrateNamespace`."],["LoadedSection","Represents a section that has been loaded and is part of a `LoadedCrate`. The containing `SectionType` enum determines which type of section it is."],["LoadedSectionInner","The parts of a `LoadedSection` that may be mutable, i.e.,  only the parts that could change after a section is initially loaded and linked."],["RelocationEntry","The information necessary to calculate and write a relocation value, based on a source section and a target section, in which a value  based on the location of the source section is written somwhere in the target section."],["StrRef","A wrapper around an `Arc<str>`: an immutable shared reference to a string slice."],["StrongDependency","A representation that the owner `A` of (a `LoadedSection` object containing) this struct depends on the given `section` `B` in this struct. The dependent section `A` is not specifically included here; since it’s the owner of this struct, it’s implicit that it’s the dependent one."],["WeakDependent","A representation that the `section` `A` in this struct depends on the owner `B` of (the `LoadedSection` object containing) this struct.  The target dependency `B` is not specifically included here;  it’s implicitly the owner of this struct."]],"type":[["Shndx","A Section Header iNDeX (SHNDX), as specified by the ELF format.  Even though this is typically encoded as a `u16`, its decoded form can exceed the max size of `u16`."],["StrongCrateRef","A Strong reference to a [`LoadedCrate`]."],["StrongSectionRef","A Strong reference ([`Arc`]) to a [`LoadedSection`]."],["WeakCrateRef","A Weak reference to a [`LoadedCrate`]."],["WeakSectionRef","A Weak reference ([`Weak`]) to a [`LoadedSection`]."]]};