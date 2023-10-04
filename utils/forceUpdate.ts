import { useState } from 'react'

export const useForceUpdate = (): [number, () => void] => {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}
