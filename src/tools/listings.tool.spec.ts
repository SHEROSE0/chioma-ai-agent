import {
  GetMatchScoreTool,
  GetRecommendationsTool,
  GetSimilarPropertiesTool,
} from './listings.tool';
import { ChiomaApiClient } from '../integrations/chioma-api/chioma-api.client';

describe('listings tools', () => {
  const context = { accessToken: 'tok' };

  function makeClient() {
    const getRecommendations = jest.fn<
      ReturnType<ChiomaApiClient['getRecommendations']>,
      Parameters<ChiomaApiClient['getRecommendations']>
    >();
    const getMatchScore = jest.fn<
      ReturnType<ChiomaApiClient['getMatchScore']>,
      Parameters<ChiomaApiClient['getMatchScore']>
    >();
    const getSimilarProperties = jest.fn<
      ReturnType<ChiomaApiClient['getSimilarProperties']>,
      Parameters<ChiomaApiClient['getSimilarProperties']>
    >();
    const client = {
      getRecommendations,
      getMatchScore,
      getSimilarProperties,
    } as unknown as ChiomaApiClient;
    return { client, getRecommendations, getMatchScore, getSimilarProperties };
  }

  it('GetRecommendationsTool forwards the access token and default limit', async () => {
    const { client, getRecommendations } = makeClient();
    getRecommendations.mockResolvedValue([{ propertyId: 'p1', score: 0.9, reasons: [] }]);
    const tool = new GetRecommendationsTool(client);

    const result = await tool.execute({}, context);

    expect(getRecommendations).toHaveBeenCalledWith('tok', 10);
    expect(JSON.parse(result)).toEqual([{ propertyId: 'p1', score: 0.9, reasons: [] }]);
  });

  it('GetRecommendationsTool honors an explicit limit', async () => {
    const { client, getRecommendations } = makeClient();
    getRecommendations.mockResolvedValue([]);
    const tool = new GetRecommendationsTool(client);

    await tool.execute({ limit: 3 }, context);

    expect(getRecommendations).toHaveBeenCalledWith('tok', 3);
  });

  it('GetMatchScoreTool passes through the propertyId', async () => {
    const { client, getMatchScore } = makeClient();
    getMatchScore.mockResolvedValue({ propertyId: 'p1', score: 0.5, reasons: [] });
    const tool = new GetMatchScoreTool(client);

    const result = await tool.execute({ propertyId: 'p1' }, context);

    expect(getMatchScore).toHaveBeenCalledWith('tok', 'p1');
    expect(JSON.parse(result)).toEqual({ propertyId: 'p1', score: 0.5, reasons: [] });
  });

  it('GetSimilarPropertiesTool uses the default limit when not provided', async () => {
    const { client, getSimilarProperties } = makeClient();
    getSimilarProperties.mockResolvedValue([]);
    const tool = new GetSimilarPropertiesTool(client);

    await tool.execute({ propertyId: 'p1' }, context);

    expect(getSimilarProperties).toHaveBeenCalledWith('tok', 'p1', 5);
  });
});
