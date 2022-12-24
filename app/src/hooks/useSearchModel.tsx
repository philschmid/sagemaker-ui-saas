import { useState, useMemo, useRef } from 'react'

// TODO: Refactor to react query
export default function useContentOrigins() {
  const requestParams = useRef({})
  const [models, setModels] = useState([])
  const [status, setStatus] = useState('finished')

  async function doRequest({ filteringText }) {
    setStatus('loading')
    console.log(filteringText)
    try {
      const response = await fetch(`https://huggingface.co/api/quicksearch?q=${filteringText}&type=model`, {})
      // @ts-ignore
      const rawModels = await response.json()
      const foundModels = rawModels.models.map((model) => {
        return { label: model.id, value: model.id }
      })
      setModels(foundModels)
      setStatus('finished')
    } catch (error) {
      setStatus('error')
    }
  }

  const handlers = useMemo(() => {
    return {
      async onLoadItems({ detail }) {
        await doRequest(detail)
      },
    }
  }, [requestParams])
  // @ts-ignore
  return [{ models, filteringText: requestParams.current.filteringText, status }, handlers]
}
