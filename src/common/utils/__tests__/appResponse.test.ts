import { Response } from 'express';
import { AppResponse } from '../appResponse';

describe('AppResponse', () => {
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
  });

  it('should send a response with custom status code, data, and message', () => {
    const testData = { key: ['value'] };
    AppResponse(mockResponse as Response, 201, testData, 'Custom message');

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'success',
      data: testData,
      message: 'Custom message',
    });
  });

  it('should handle string data', () => {
    AppResponse(mockResponse as Response, 200, 'String data', 'Message');

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'success',
      data: 'String data',
      message: 'Message',
    });
  });

  it('should handle undefined data', () => {
    AppResponse(mockResponse as Response, 204, undefined, 'No Content');

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'success',
      data: null,
      message: 'No Content',
    });
  });
});
