import AppError from '../appError';

describe('AppError', () => {
  it('should create an instance with default status code', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('Error');
    expect(error.isOperational).toBe(true);
    expect(error.data).toBeUndefined();
  });

  it('should create an instance with custom status code', () => {
    const error = new AppError('Server error', 500);
    expect(error.message).toBe('Server error');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('Failed');
    expect(error.isOperational).toBe(true);
    expect(error.data).toBeUndefined();
  });

  it('should create an instance with custom data', () => {
    const customData = { key: 'value' };
    const error = new AppError('Data error', 422, customData);
    expect(error.message).toBe('Data error');
    expect(error.statusCode).toBe(422);
    expect(error.status).toBe('Error');
    expect(error.isOperational).toBe(true);
    expect(error.data).toEqual(customData);
  });

  it('should have a stack trace', () => {
    const error = new AppError('Stack trace test');
    expect(error.stack).toBeDefined();
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Instance test');
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of AppError', () => {
    const error = new AppError('Instance test');
    expect(error).toBeInstanceOf(AppError);
  });
});
