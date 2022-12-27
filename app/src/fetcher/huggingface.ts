import fm from 'front-matter';
import { taskOptions } from '../routes/CreateEndpoint';

interface modelDetail {
  id: string;
  license: string;
  pipeline_tag: string;
  tags: string[];
  downloads: number;
  library_name: string;
  metrics: any;
  transformersInfo: any;
  modelCardMarkdown: string;
}

export interface modelPreviewType {
  id: string;
  license: string;
  pipeline_tag: string;
  downloads: number;
  library_name: string;
}

export const fetchModels = async () => {
  const response = await fetch(`https://huggingface.co/api/models?sort=downloads&limit=1000&direction=-1&full=true`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data.map((model: any) => {
    // extract license 
    const license_string = model.tags.filter((tag: string) => tag.startsWith('license'))[0] || 'no:no license'
    console.log()
    return {
      id: model.id,
      license: (license_string.split(':')[1] || 'no license').toUpperCase(),
      pipeline_tag: taskOptions[model.pipeline_tag] || 'No task',
      downloads: model.downloads,
      library_name: model.library_name || 'no library name',
    }
  }) as modelPreviewType[];
}

export const getModelDetail = async ({ queryKey }): Promise<modelDetail> => {
  const [_, modelId] = queryKey

  const response = await fetch(`https://huggingface.co/api/models/${modelId}`);
  const modelCardResponse = await fetch(`https://huggingface.co/${modelId}/resolve/main/README.md`);
  if (!response.ok || !modelCardResponse.ok) {
    throw new Error(response.statusText);
  }
  const modelCard = await modelCardResponse.text()
  const modelInfo = await response.json()


  const model: modelDetail = {
    id: modelInfo.id,
    license: modelInfo.cardData?.license || 'no license',
    pipeline_tag: modelInfo.pipeline_tag || 'no pipeline tag',
    tags: modelInfo.tags || [],
    downloads: modelInfo.downloads,
    library_name: modelInfo.library_name || 'no library name',
    metrics: modelInfo['model-index'] ? modelInfo["model-index"][0].results : [],
    transformersInfo: modelInfo.transformersInfo,
    modelCardMarkdown: fm(modelCard).body
  }
  return model;
}

