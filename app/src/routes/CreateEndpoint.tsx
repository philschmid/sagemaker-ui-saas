/*********************************************************************************************************************
 Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License").
 You may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 ******************************************************************************************************************** */

import { useContext, useEffect } from 'react'
import { AppLayoutContext } from '../App'
import { Button, FormField, Grid, Header, Container, Link, Select, SpaceBetween } from '@cloudscape-design/components'
import Form from '@cloudscape-design/components/form'

import useContentOrigins from '../hooks/useSearchModel'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
export const InfoLink = ({ id, onFollow, ariaLabel }) => (
  <Link variant="info" id={id} onFollow={onFollow} ariaLabel={ariaLabel}>
    Info
  </Link>
)

/**
 * Component to render the home "/" route.
 */
const CreateEndpoint: React.FC = () => {
  const { setAppLayoutProps } = useContext(AppLayoutContext)

  useEffect(() => {
    setAppLayoutProps({
      contentHeader: (
        <Header
          variant="h1"
          info={
            <InfoLink
              id="form-main-info-link"
              onFollow={() => console.log('open') /* loadHelpPanelContent(0) */}
              ariaLabel={'Information about how to create a distribution.'}
            />
          }
          description="Create a new Amazon SageMaker Endpoint for running Hugging Face models."
        >
          Create new SageMaker Endpoint
        </Header>
      ),
    })
  }, [setAppLayoutProps])

  return (
    <SpaceBetween size="l">
      <Container>
        <CreateForm></CreateForm>
      </Container>
    </SpaceBetween>
  )
}

export default CreateEndpoint

const TaskOptions = {
  'text-classification': 'Text Classification',
  'text-generation': 'Text Generation',
  'token-classification': 'Token Classification',
  'question-answering': 'Question Answering',
  'table-question-answering': 'Table Question Answering',
  summarization: 'Summarization',
  translation: 'Translation',
  conversational: 'Conversational',
  'text2text-generation': 'Text2Text Generation',
  'fill-mask': 'Fill Mask',
  'text-to-image': 'Text to Image',
  custom: 'Custom',
}
// convert TaskOptions to an array of objects
const TaskOptionsArray = Object.keys(TaskOptions).map((key) => {
  return { label: TaskOptions[key], value: key }
})

const defaultState = {
  modelId: null,
  task: null,
}

const CreateForm: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = React.useState({
    modelId: searchParams.get('modelId') || '',
    task: searchParams.get('task') || '',
  })

  const [contentOriginsState, contentOriginsHandlers] = useContentOrigins()
  const [distributionPanelData, setDistributionPanelData] = React.useState(defaultState)

  const onChange = async (attribute, value) => {
    const newState = { ...formData }
    newState[attribute] = value.value

    if (attribute === 'modelId') {
      const resp = await fetch(`https://huggingface.co/api/models/${value.value}`, {})
      const meta = await resp.json()
      // @ts-ignore
      newState.task = meta.pipeline_tag ? meta.pipeline_tag : null
    }
    setFormData(newState)
  }
  const getErrorText = (errorMessage) => {
    return errorMessage
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary">Launch</Button>
          </SpaceBetween>
        }
        header={<Header variant="h2">Hugging Face configuration</Header>}
      >
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <FormField
            description="Hugging Face Model ID"
            label="Model ID"
            // errorText={!formData.modelId && && getErrorText('You must specify a valid Hugging Face Model ID')}
            i18nStrings={{ errorIconAriaLabel: 'Error' }}
          >
            <Select
              {...contentOriginsHandlers}
              // @ts-ignore
              options={contentOriginsState.models}
              selectedAriaLabel="Selected"
              // @ts-ignore
              statusType={contentOriginsState.status}
              placeholder="organization/repository"
              loadingText="Loading Models"
              errorText="Error fetching models."
              recoveryText="Retry"
              // @ts-ignore
              empty={contentOriginsState.filteringText ? "We can't find a match" : 'No models found'}
              filteringType="manual"
              filteringAriaLabel="Filter models"
              ariaRequired={true}
              selectedOption={{ label: formData.modelId, value: formData.modelId }}
              onChange={({ detail: { selectedOption } }) => onChange('modelId', selectedOption)}
            />
          </FormField>
          <FormField
            description="Pipeline task for the model"
            label="Task"
            // errorText={!formData.task && getErrorText('You must specify a valid Hugging Face Model ID')}
            i18nStrings={{ errorIconAriaLabel: 'Error' }}
          >
            <Select
              {...contentOriginsHandlers}
              // @ts-ignore
              options={TaskOptionsArray}
              placeholder="task"
              ariaRequired={true}
              selectedOption={{ label: TaskOptions[formData.task], value: formData.task }}
              onChange={({ detail: { selectedOption } }) => onChange('task', selectedOption)}
            />
          </FormField>
        </Grid>
      </Form>
    </form>
  )
}
