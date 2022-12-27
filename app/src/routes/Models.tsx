import { useContext, useEffect, useMemo } from 'react'
import { AppLayoutContext } from '../App'
import { RuntimeConfigContext } from '../auth/Auth'
import { fetchModels, modelPreviewType } from '../fetcher/huggingface'
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

/**
 * Component to render the home "/" route.
 */
const Models: React.FC = () => {
  const navigate = useNavigate()
  const { isError, isSuccess, isLoading, data, error } = useQuery(['products'], fetchModels)
  const [filteringText, setFilteringText] = React.useState('')
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const filteredModels = data?.filter((p) => p.id.includes(filteringText))

  // group data into 25 items per page
  const itemsPerPage = 25
  const groupedData = useMemo(() => {
    if (!filteredModels) return []
    const groups = []
    for (let i = 0; i < filteredModels?.length || 0; i += itemsPerPage) {
      // @ts-ignore
      groups.push(filteredModels.slice(i, i + itemsPerPage))
    }
    return groups
  }, [filteredModels])

  if (isLoading) return <div>Loading...</div>

  return (
    <Table
      columnDefinitions={[
        {
          id: 'model',
          header: 'Model Id',
          cell: (e: modelPreviewType) => (
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
          header: 'Task',
          cell: (e) => e.pipeline_tag,
          sortingField: 'alt',
        },
        {
          id: 'license',
          header: 'License',
          cell: (e) => e.license,
          sortingField: 'alt',
        },
        {
          id: 'downloads',
          header: 'Downloads',
          cell: (e) => <code>{e.downloads.toLocaleString('en-US')}</code>,
          sortingField: 'model',
        },
        {
          id: 'library',
          header: 'Library',
          cell: (e) => e.library_name,
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
      items={groupedData[currentPageIndex]}
      stickyHeader
      loadingText="Loading resources"
      header={
        <Header
          variant="h1"
          counter={`(${itemsPerPage * currentPageIndex}/${
            data?.length !== filteredModels?.length ? filteredModels?.length : data?.length
          })`}
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
      pagination={
        <Pagination
          ariaLabels={{
            nextPageLabel: 'Next page',
            previousPageLabel: 'Previous page',
            pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
          }}
          currentPageIndex={currentPageIndex + 1}
          onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex - 1)}
          pagesCount={groupedData.length}
        />
      }
      empty={
        <Box textAlign="center" color="inherit">
          <b>No Models</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No Models to display.
          </Box>
        </Box>
      }
    />
  )
}

export default Models
