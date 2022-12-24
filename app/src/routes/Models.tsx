import { useContext, useEffect, useMemo } from 'react'
import { AppLayoutContext } from '../App'
import { RuntimeConfigContext } from '../auth/Auth'
import { fetchModels } from '../fetcher/huggingface'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  Box,
  Button,
  Header,
  Pagination,
  TextFilter,
  CollectionPreferences,
  Link,
} from '@cloudscape-design/components'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

type model = {
  id: string
  pipeline_tag: string
  downloads: number
}

/**
 * Component to render the home "/" route.
 */
const Models: React.FC = () => {
  const navigate = useNavigate()
  const { isError, isSuccess, isLoading, data, error } = useQuery(['products'], fetchModels, { staleTime: 3000 })
  const [filteringText, setFilteringText] = React.useState('')
  const filteredModels = data?.filter((p) => p.id.includes(filteringText))

  if (isLoading) return <div>Loading...</div>

  return (
    <Table
      columnDefinitions={[
        {
          id: 'model',
          header: 'Model Id',
          cell: (e: model) => (
            <Link
              onFollow={() => {
                navigate(e.id)
              }}
            >
              {e.id}
            </Link>
            // <Navigate to={`/models/${e.id}`} replace={true} />
          ),
          sortingField: 'model',
        },
        {
          id: 'pipeline',
          header: 'task',
          cell: (e) => e.pipeline_tag,
          sortingField: 'alt',
        },
        {
          id: 'downloads',
          header: 'Downloads',
          cell: (e) => e.downloads,
          sortingField: 'model',
        },
      ]}
      filter={
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Find models"
          filteringAriaLabel="Filter models"
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
        />
      }
      variant="full-page"
      items={filteredModels}
      stickyHeader
      loadingText="Loading resources"
      header={
        <Header
          variant="h1"
          counter={`(${filteredModels.length}/${data.length})`}
          description={
            <span>
              List of avialble models on{' '}
              <Link external externalIconAriaLabel="Opens in a new tab" href="https://huggingface.co/models">
                Hugging Face
              </Link>
            </span>
          }
        >
          Hugging Face Models
        </Header>
      }
      empty={
        <Box textAlign="center" color="inherit">
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No resources to display.
          </Box>
          <Button>Create resource</Button>
        </Box>
      }
    />
  )
}

export default Models
