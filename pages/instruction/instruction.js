class Instruction {
    static instructionTag = document.querySelector('.instruction');
    static instructionButtons = document.querySelectorAll('.instruction .buttons .button');
    static instructionHandlers = [];
    static openPage() {
        Instruction.instructionTag.style.display = 'flex';
    }
    static closePage() {
        Instruction.instructionTag.style.display = 'none';
        Menu.openPage();
    }
    static setAEL() {
        for (let i = 0; i < Instruction.instructionButtons.length; i++) {
            Instruction.instructionHandlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'instruction_back':
                        Instruction.closePage();
                        Menu.openPage();
                        break;
                }
            };
            Instruction.instructionButtons[i].addEventListener('click', Instruction.instructionHandlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < Instruction.instructionButtons.length; i++) {
            Instruction.instructionButtons[i].removeEventListener('click', Instruction.instructionHandlers[i], false);
            Instruction.instructionHandlers[i] = null;
        }
        Instruction.instructionHandlers = [];
    }
}