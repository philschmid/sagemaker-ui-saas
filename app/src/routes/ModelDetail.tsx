import { useContext, useEffect, useMemo } from 'react'
import { AppLayoutContext } from '../App'
import { RuntimeConfigContext } from '../auth/Auth'
import { fetchModels, getModelDetail } from '../fetcher/huggingface'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  Box,
  Button,
  Pagination,
  Badge,
  TextFilter,
  Icon,
  CollectionPreferences,
  Grid,
  ColumnLayout,
  Link,
  TextContent,
} from '@cloudscape-design/components'
import { Container, Header, SpaceBetween } from '@cloudscape-design/components'
import Markdown from 'markdown-to-jsx'

import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Component to render the home "/" route.
 */
const ModelDetail: React.FC = () => {
  const navigate = useNavigate()
  let { user, repo } = useParams()
  const modelId = repo ? `${user}/${repo}` : user
  //   params: { personId },
  // } = props.match
  const { setAppLayoutProps } = useContext(AppLayoutContext)
  const { isError, isSuccess, isLoading, data, error } = useQuery(['model', modelId], getModelDetail, {
    staleTime: 3000,
  })
  const gridLayout = data?.metrics.length > 0 ? [{ colspan: 8 }, { colspan: 4 }] : [{ colspan: 12 }]

  useEffect(() => {
    setAppLayoutProps({
      contentHeader: (
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/endpoints/new?modelId=${modelId}&task=${data?.pipeline_tag}`)
                }}
              >
                Launch Endpoint
              </Button>
              <Button href={`https://huggingface.co/${modelId}`} target="_blank">
                View on HuggingFace <Icon name="external" variant="link" />
              </Button>
            </SpaceBetween>
          }
          info={<Link variant="info">Info</Link>}
        >
          Model: <code>{modelId}</code>
        </Header>
      ),
    })
  }, [data])

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <SpaceBetween size="l">
        <Grid gridDefinition={gridLayout}>
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Model Info</Header>}>
              <ColumnLayout columns={3} variant="text-grid">
                <SpaceBetween size="s">
                  <Box variant="awsui-key-label">License</Box>
                  <div>{data?.license}</div>
                </SpaceBetween>

                <SpaceBetween size="s">
                  <Box variant="awsui-key-label">Task</Box>
                  <div>{data?.pipeline_tag}</div>
                </SpaceBetween>
                <SpaceBetween size="s">
                  <Box variant="awsui-key-label">Library</Box>
                  <code>{data?.library_name}</code>
                </SpaceBetween>
              </ColumnLayout>
            </Container>
            <Container>
              <TextContent>
                <Markdown style={{ overflow: 'hidden' }}>{data?.modelCardMarkdown || ''}</Markdown>
              </TextContent>
            </Container>
          </SpaceBetween>

          {data?.metrics.length > 0 && (
            <Container header={<Header variant="h2">Metrics</Header>}>
              {data?.metrics.map(({ dataset, metrics, task }) => (
                <SpaceBetween size="xs">
                  <Box variant="h4">dataset: {dataset.name}</Box>
                  <div>
                    {metrics.map(({ name, value }) => (
                      <div key={name}>
                        {name}: <strong>{value}</strong>{' '}
                      </div>
                    ))}
                  </div>
                </SpaceBetween>
              ))}
            </Container>
          )}
        </Grid>
      </SpaceBetween>
    </>
  )
}

export default ModelDetail
