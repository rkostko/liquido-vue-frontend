/**
 * <h1>Test data for liquido</h1>
 * 
 * update or insert = upsert
 * 
 * This is delibaretly a JavaScript module, and not just a JSON dump,
 * so that you can use the full power of your JS interpreter here.
 * 
 * Keep in mind that testData is an array and items will be inserted in the order
 * that they appear in the array. So if you reference IDs ('foreign keys'), then
 * make sure that the referenced document was already insereted before.
 */
var ObjectID = require('mongodb').ObjectID;
var testData = [];

//based on http://stackoverflow.com/questions/13838441/javascript-how-to-calculate-the-date-that-is-2-days-ago#13838662
var daysAgo = function(nDays) {
  var daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - nDays);
  return daysAgo;
};

// test users
for(var i = 0; i<5; i++) {
  var user = {
    collection: 'users',
    query:  {email: 'testuser'+i+'@liquido.de'},
    update: {
      email: 'testuser'+i+'@liquido.de',
      password: 'nopass',  // hashed password
      profile: {
        name: 'Test User'+i,
        website: 'http://www.liquido.de',
        picture: 'http://www.avatar.org/img'+i+'.png'
      },
      createdAt: daysAgo(20-i),
      updatedAt: daysAgo(19-i)
    }
  };
  testData.push(user);
}

//TODO: create test areas


// delegations between test users (from delegee to proxy user)
testData = testData.concat([
  { 
    collection: "delegations",
    query: {},
    update: {
      from: { "$ref": {
        collection: 'users',
        query: { email: 'testuser0@liquido.de' } 
      } },
      to: { "$ref":  {
        collection: 'users',
        query: { email: 'testuser1@liquido.de' } 
      } },
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10)
    }
  },
]);

/*
// create test ideas
testData = testData.concat([
  {
    collection: 'ideas',
    query:  { title:"Idea 1" },
    update: {
      title:"Idea 1",
      description:"This is a rather long description for this idea",
      createdBy: { 
        "$ref": {
          collection: 'users',
          query: {email: 'testuser1@liquido.de'} 
        },
      },
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10)
    }
  },
  {
    collection: 'ideas',
    query:  { title:"Idea 2" },
    update: {
      title:"Idea 2",
      description:"Second idea We need to do this",
      createdBy: { 
        "$ref": {
          collection: 'users',
          query: {email: 'testuser2@liquido.de'} 
        },
      },
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8)
    }
  },
  {
    collection: 'ideas',
    query:  { title:"Idea 3" },
    update: {
      title:"Idea 3",
      description:"Third idea that may be related to another idea but is even better",
      createdBy: { 
        "$ref": {
          collection: 'users',
          query: {email: 'testuser3@liquido.de'} 
        },
      },
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1)
    }
  },
]);


// constants
//TODO: move these to a central place
const LAW_PROPOSAL = 0;

// create some (proposals) for a law
testData = testData.concat([
  {
    collection: 'laws',
    query:  {title:"Law 1"  },
    update: {
      title:"Law 1",
      description:"Genious proposal for a law",
      status: LAW_PROPOSAL,
      createdBy: { 
        "$ref": {
          collection: 'users',
          query: {email: 'testuser3@liquido.de'} 
        },
      },
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1),
    }
  }
]);

// test ballots
testData = testData.concat([
  {
    collection: 'ballots',
    query:  {title:""  },
    update: {
    }
  },
]);
*/
module.exports = { 
  testData: testData
};