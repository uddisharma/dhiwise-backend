/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../../app');
const authConstant = require('../../constants/authConstant');
const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let insertedUser = {};

/**
 * @description : model dependencies resolver
 */
beforeAll(async function (){
  try {
    await client.connect();
    const dbInstance = client.db('EcomDb_test');

    const user = dbInstance.collection('users');
    insertedUser = await user.insertOne({
      username: 'Madison16',
      password: 'JEgHjyH7iXTJ0c2',
      email: 'Mariam.Bode28@yahoo.com',
      name: 'Ed Feil',
      shippingAddress: [
        {
          _id: false,
          pincode: 'deposit',
          address1: 'Pants',
          address2: 'invoice',
          landmark: 'copy',
          city: 'aggregate',
          isDefault: false,
          state: 'Won',
          addressType: 'dynamic',
          fullName: 'withdrawal',
          mobile: 979,
          addressNo: 617
        }
      ],
      wishlist: [ {
        _id: false,
        productId: 'Rustic' 
      } ],
      userType: 505,
      mobileNo: '(472) 972-4869',
      loginOTP: {},
      resetPasswordLink: {},
      loginRetryLimit: 669,
      loginReactiveTime: '2024-11-29T03:40:18.526Z',
      id: '65eeb155d06cb70305a5aabd'
    });
  }
  catch (error) {
    console.error(`we encountered ${error}`);
  }
  finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a user', async () => {
    let registeredUser = await request(app)
      .post('/desktop/auth/register')
      .send({
        'username':'Daniella_Bashirian',
        'password':'0limBMEk86kXfXm',
        'email':'Kieran_Kessler@gmail.com',
        'name':'Darrel McClure',
        'shippingAddress':[{
          '_id':false,
          'pincode':'deliver',
          'address1':'mission-critical',
          'address2':'bi-directional',
          'landmark':'Supervisor',
          'city':'Turkmenistan',
          'isDefault':false,
          'state':'Rustic',
          'addressType':'azure',
          'fullName':'Barbados',
          'mobile':678,
          'addressNo':858
        }],
        'wishlist':[{
          '_id':false,
          'productId':'bandwidth'
        }],
        'userType':authConstant.USER_TYPES.User,
        'mobileNo':'(251) 348-3826',
        'addedBy':insertedUser.insertedId,
        'updatedBy':insertedUser.insertedId
      });
    expect(registeredUser.statusCode).toBe(200);
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/desktop/auth/forgot-password')
      .send({ email: '' });

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let user = await request(app)
      .post('/desktop/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(user.statusCode).toBe(404);
    expect(user.body.status).toBe('RECORD_NOT_FOUND');
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    let user = await request(app)
      .post('/desktop/auth/forgot-password')
      .send({ 'email':'Kieran_Kessler@gmail.com', });

    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('SUCCESS');
  });
});

describe('POST /validate-otp -> OTP is sent in request body and OTP is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/desktop/auth/login')
      .send(
        {
          username: 'Daniella_Bashirian',
          password: '0limBMEk86kXfXm'
        }).then(login => () => {
        return request(app)
          .get(`/desktop/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .post('/desktop/auth/validate-otp')
              .send({ 'otp': foundUser.body.data.resetPasswordLink.code, }).then(user => {
                expect(user.statusCode).toBe(200);
                expect(user.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let user = await request(app)
      .post('/desktop/auth/validate-otp')
      .send({ 'otp': '12334' });
    
    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('FAILURE');
    
  });
});

describe('POST /validate-otp -> if request body is empty or OTP has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .post('/desktop/auth/validate-otp')
      .send({});

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/desktop/auth/login')
      .send(
        {
          username: 'Daniella_Bashirian',
          password: '0limBMEk86kXfXm'
        }).then(login => () => {
        return request(app)
          .get(`/desktop/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .put('/desktop/auth/validate-otp')
              .send({
                'code': foundUser.body.data.resetPasswordLink.code,
                'newPassword':'newPassword'
              }).then(user => {
                expect(user.statusCode).toBe(200);
                expect(user.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .put('/desktop/auth/reset-password')
      .send({});
    
    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let user = await request(app)
      .put('/desktop/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('FAILURE');

  });
});

afterAll(function (done) {
  db.connection.db.dropDatabase(function () {
    db.connection.close(function () {
      done();
    });
  });
});
