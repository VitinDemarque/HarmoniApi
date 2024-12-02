import {v7} from 'uuid'

export const generatedId = (): string => {
    return v7 ()
}
