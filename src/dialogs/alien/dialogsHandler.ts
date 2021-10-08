import { ITalk } from "../../interfaces/dialogs.interface"
import { state } from "../../state/state"
import alienDialogs from "./dialogs-FR"

export const retrieveAlienDialogs = (): ITalk => {
    if (!state.possessYellowKey) {
        return alienDialogs["WITHOUT_KEYS"]
    } else {
        return alienDialogs["WITH_YELLOW_KEY"]
    }
}