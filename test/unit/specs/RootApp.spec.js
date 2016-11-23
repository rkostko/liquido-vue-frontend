/**
 * Mocha unit tests for RootApp.vue (and also for BaseRestClient)
 * This test cases will run inside PhantomJS, a headleas browser.
 */

/* global expect */

import rootApp from 'src/components/RootApp'
var log = require("loglevel").getLogger("RootApp.spec");

//if (process.env.NODE_ENV == 'testing') {
//  log.debug("================ SETTING LOG LEVEL in IdeaService.spec.js")
//  log.setLevel("trace")  // trace == log everything
//}

describe('RootApp.vue', () => {
  //You can run a single KARMAA test case with   it.only(...)

  // MochaJS "before all hock": this runs once before all tests in this block (should be called beforeAll :-)
  before(function() {
    //this.timeout(5000)
  })

  it('fetch all areas', () => {
    return rootApp.fetchAllAreas().then(allAreas => {
      expect(allAreas.length).toBeGreaterThan(4)
      expect(allAreas[0].title).toBeContain("Area 0")
    })
  })


})
