import { Request, Response } from 'express';
import { catchAsync } from '../catchAsyncErrors';

describe('catchAsync', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: jest.Mock;

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			json: jest.fn(),
			status: jest.fn().mockReturnThis(),
		};
		mockNext = jest.fn();
	});

	it('should call the provided function with request, response, and next', async () => {
		const mockHandler = jest.fn().mockResolvedValue('success');
		const wrappedHandler = catchAsync(mockHandler);

		await wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
	});

	it('should call next with caught error if the function throws', async () => {
		const error = new Error('Test error');
		const mockHandler = jest.fn().mockRejectedValue(error);
		const wrappedHandler = catchAsync(mockHandler);

		await wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockNext).toHaveBeenCalledWith(error);
	});

	it('should not call next if the function resolves successfully', async () => {
		const mockHandler = jest.fn().mockResolvedValue('success');
		const wrappedHandler = catchAsync(mockHandler);

		await wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockNext).not.toHaveBeenCalled();
	});

	it('should handle async functions that do not return anything', async () => {
		const mockHandler = jest.fn().mockImplementation(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
		});
		const wrappedHandler = catchAsync(mockHandler);

		await wrappedHandler(mockRequest as Request, mockResponse as Response, mockNext);

		expect(mockHandler).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});
});
