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
  StatusIndicator,
  SpaceBetween,
  Link,
} from '@cloudscape-design/components'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { endpointDetail, fetchEndpoints } from '../fetcher/sagemaker'

/**
 * Component to render the home "/" route.
 */
const Endpoints: React.FC = () => {
  const navigate = useNavigate()
  const { setAppLayoutProps } = useContext(AppLayoutContext)
  const { isError, isSuccess, isLoading, data, error } = useQuery(['endpoints'], fetchEndpoints)
  const [filteringText, setFilteringText] = React.useState('')
  const filteredEndpoints: any[] = data?.filter((p) => p.id.includes(filteringText)) || []
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0)
  const [selectedItems, setSelectedItems] = React.useState<endpointDetail[]>([])
  // group data into 25 items per page
  const itemsPerPage = 25
  const groupedData = useMemo(() => {
    const groups = []
    for (let i = 0; i < filteredEndpoints.length || 0; i += itemsPerPage) {
      // @ts-ignore
      groups.push(filteredEndpoints.slice(i, i + itemsPerPage))
    }
    return groups
  }, [filteredEndpoints])

  if (isLoading) return <div>Loading...</div>

  return (
    <Table
      columnDefinitions={[
        {
          id: 'name',
          header: 'Endpoint Name',
          cell: (e: endpointDetail) => (
            <Link
              onFollow={() => {
                navigate(e.name)
              }}
            >
              {e.id}
            </Link>
            // <Navigate to={`/models/${e.id}`} replace={true} />
          ),
          sortingField: 'name',
        },
        {
          id: 'model',
          header: 'Model Id',
          cell: (e) => e.modelId,
        },
        {
          id: 'status',
          header: 'status',
          cell: (e) => (
            <>
              <StatusIndicator
                type={
                  e.status === 'RUNNING'
                    ? 'success'
                    : e.status === 'STOPPED'
                    ? 'stopped'
                    : e.status === 'CREATING'
                    ? 'in-progress'
                    : 'error'
                }
              >
                {' '}
                {e.status}{' '}
              </StatusIndicator>
            </>
          ),
        },
        {
          id: 'url',
          header: 'Url',
          cell: (e) => e.url,
        },
      ]}
      onSelectionChange={({ detail }) => {
        console.log(detail)
        setSelectedItems(detail.selectedItems)
      }}
      selectionType="single"
      selectedItems={selectedItems}
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
            data?.length !== filteredEndpoints.length ? filteredEndpoints.length : data?.length
          })`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => {
                  navigate(`/endpoints/new`)
                }}
              >
                Edit
              </Button>
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => {
                  navigate(`/endpoints/new`)
                }}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/endpoints/new`)
                }}
              >
                Launch Endpoint
              </Button>
            </SpaceBetween>
          }
          description={<span>List of deployed Hugging Face models on as endpoint</span>}
        >
          SageMaker Endpoints
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
          <b>No endpoints</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No endpoints to display.
          </Box>
          <Button
            onClick={() => {
              navigate(`/endpoints/new`)
            }}
          >
            Create endpoint
          </Button>
        </Box>
      }
    />
  )
}

export default Endpoints
