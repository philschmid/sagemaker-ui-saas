import fm from 'front-matter';

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

export const fetchModels = async () => {
  const response = await fetch(`https://huggingface.co/api/models?sort=downloads&limit=100&direction=-1`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
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

