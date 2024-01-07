const authenticateMiddleware = require('../../src/middlewares/authenticate');
const config = require('../../src/config');
const User = require('../../src/models/userModel');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../../src/models/userModel');

describe('Authenticate Middleware', () => {
  it('should authenticate user for valid token', async () => {
    const token = 'valid-token';
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: 'user-id' });
    User.findById.mockResolvedValue({ _id: 'user-id', username: 'Exemplo', role: 'admin' });

    await authenticateMiddleware(req, res, next);

    expect(req.user).toBeDefined();
    expect(User.findById).toHaveBeenCalledWith('user-id');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authenticateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', async () => {
    const req = { header: jest.fn().mockReturnValue('invalid-token') };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authenticateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});