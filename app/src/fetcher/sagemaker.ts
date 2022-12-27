


export interface endpointDetail {
  id: string;
  name: string
  status: 'RUNNING' | 'STOPPED' | 'DELETING' | 'FAILED' | 'CREATING' | 'UPDATING';
  modelId: string;
  url: string;
  tags: string[];
}

export const fetchEndpoints = async () => {
  // TODO: call lambda function who calls sagemaker API
  // const response = await fetch(`https://huggingface.co/api/models?sort=downloads&limit=1000&direction=-1`);
  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }
  // const data = await response.json();

  const data: endpointDetail[] = [
    {
      id: 'endpoint-1',
      name: 'endpoint-1',
      status: 'RUNNING',
      modelId: 'model-1',
      url: 'https://endpoint-1',
      tags: ['tag-1', 'tag-2']
    },
    {
      id: 'endpoint-2',
      name: 'endpoint-2',
      status: 'STOPPED',
      modelId: 'model-2',
      url: 'https://endpoint-2',
      tags: ['tag-1', 'tag-2']
    },
    {
      id: 'endpoint-3',
      name: 'endpoint-3',
      status: 'CREATING',
      modelId: 'model-3',
      url: 'https://endpoint-3',
      tags: ['tag-1', 'tag-2']
    },
    {
      id: 'endpoint-4',
      name: 'endpoint-4',
      status: 'FAILED',
      modelId: 'model-4',
      url: 'https://endpoint-4',
      tags: ['tag-1', 'tag-2']
    },
  ]
  return data;
}
