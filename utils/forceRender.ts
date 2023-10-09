import { useState } from 'react'

/**
 * `const [forceRenderId, setForceRenderId] = useForceRender()`
 * @returns [forceRenderId, setForceRenderId]
 */
export const useForceRender = (): [number, () => void] => {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}
