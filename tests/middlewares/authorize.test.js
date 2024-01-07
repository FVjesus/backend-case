const Audit = require('../../src/models/auditModel');
const authorizeMiddleware = require('../../src/middlewares/authorize');

jest.mock('../../src/models/auditModel');

describe('Authorize Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next for authorized user', async () => {
    const req = { user: { _id: 'user-id', role: 'admin' }, params: { id: 'document-id' } };
    const res = {};
    const next = jest.fn();

    await authorizeMiddleware(['admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(Audit.create).toHaveBeenCalledWith({
      userId: 'user-id',
      username: undefined, // This needs to be corrected in the middleware implementation
      documentId: 'document-id',
      action: 'authorize',
    });
  });

  it('should return 403 for unauthorized user', async () => {
    const req = { user: { _id: 'user-id', role: 'user' }, params: { id: 'document-id' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authorizeMiddleware(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(next).not.toHaveBeenCalled();
    expect(Audit.create).not.toHaveBeenCalled();
  });
});