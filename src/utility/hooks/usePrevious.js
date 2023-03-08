import { useRef, useEffect } from 'react'

// usePrevious :: Array a => (a -> Void, a) -> Void
//                              |_______|  |
//                                  |      |
//                              callback  deps
//
// The usePrevious hook is similar to the useEffect hook. It requires
// a callback function and an array of dependencies. Unlike the useEffect
// hook, the callback function is only called when the dependencies change.
// Hence, it's not called when the component mounts because there is no change
// in the dependencies. The callback function is supplied the previous array of
// dependencies which it can use to perform transition-based effects.
const usePrevious = (callback, deps) => {
    const func = useRef(null)

    useEffect(() => {
        func.current = callback
    }, [callback])

    const args = useRef(null)

    useEffect(() => {
        if (args.current !== null) func.current(...args.current)
        args.current = deps
    }, deps)
}

export default usePrevious;