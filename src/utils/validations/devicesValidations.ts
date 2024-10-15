import {
    IComputerSpecs,
    ILaptop,
    IPrinter,
    ISwitch,
    IRouter,
    INoBreak,
    IVoltageRegulator,
    IProjector
} from '../interfaces/devicesSpecs';

export const validateSpecs = (type: string, specs: any): boolean => {
    switch (type) {
        case 'PC': {
            const { os, motherboard, cpu, ram, storage, powerSupply } = specs as IComputerSpecs;

            if (!os || !motherboard || !cpu || !ram || !storage || !powerSupply) {
                return false;
            }
            break;
        }

        case 'LAPTOP': {
            const { os, storage, cpu, ram } = specs as ILaptop;

            if (!os || !cpu || !ram || !storage) {
                return false;
            }
            break;
        }

        case 'PRINTER': {
            const { printerType, scanner } = specs as IPrinter;
            if (!printerType || !scanner) {
                return false;
            }
            break;
        }

        case 'SWITCH': {
            const { ports } = specs as ISwitch;
            if (!ports) {
                return false;
            }
            break;
        }

        case 'ROUTER': {
            const { routerType, ports } = specs as IRouter;
            if (!routerType || !ports) {
                return false;
            }
            break;
        }

        case 'NO-BREAK': {
            const { powerCapacity, ports, backupTime } = specs as INoBreak;
            if (!powerCapacity || !ports || !backupTime) {
                return false;
            }
            break;
        }

        case 'VOLTAGE-REGULATOR': {
            const { powerCapacity, ports } = specs as IVoltageRegulator;
            if (!powerCapacity || !ports) {
                return false;
            }
            break;
        }

        case 'PROJECTOR': {
            const { brightness } = specs as IProjector;
            if (!brightness) {
                return false;
            }
            break;
        }
        default:
            return false;
    }
    return true;
};
