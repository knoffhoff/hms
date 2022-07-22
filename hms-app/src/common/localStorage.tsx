import { useState, useEffect, Dispatch, SetStateAction } from 'react'

function getOrDefaultStorageValue<S>(key: string, defaultValue: S): S {
  const initial = localStorage.getItem(key)
  return initial === null ? defaultValue : JSON.parse(initial)
}

/**
 * Local storage hook that can be used to fetch
 * value by a given key from local storage or default to some specific value.
 *
 * Generic extension of useState(); -> returns both value and SetStateAction<S>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * @see https://reactjs.org/docs/hooks-faq.html#gatsby-focus-wrapper
 */
export function useLocalStorage<S>(
  key: string,
  defaultValue: S
): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState<S>(() =>
    getOrDefaultStorageValue(key, defaultValue)
  )
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value]
  )
  return [value, setValue]
}
