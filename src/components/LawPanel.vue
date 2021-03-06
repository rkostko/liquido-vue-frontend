<template>
	<div class="panel panel-default" :data-proposaluri="law._links.self.href">
    
    <div class="panel-heading">
      <i class="pull-right fa lawIcon grey" v-bind:class="getIconFor(law)" aria-hidden="true"></i>
      <h4 class="lawTitle">{{law.title}}</h4>
    </div>

    <div class="panel-body lawDescription">
      <!-- TODO: law.tagline -->
      {{law.description}}
      
      <timeline v-if="showTimeline" :timelineData="getTimelineDataFor(law)"></timeline>
    </div>
 
    <table class="table lawFooterTable">
      <tbody>
        <tr>
          <td><img src="/static/img/Avatar_32x32.jpeg" class="media-object userPicture"></td>
          <td class="userDataSmall">
            <i class="fa fa-fw fa-user" aria-hidden="true"></i>&nbsp;{{law.createdBy.profile.name}}<br/>
            <i class="fa fa-fw fa-bookmark" aria-hidden="true"></i>&nbsp;{{law.area.title}}
          </td>
          <td class="userDataSmall">
            <i class="fa fa-fw fa-clock-o" aria-hidden="true"></i>&nbsp;{{getFromNow(law.createdAt)}}<br/>
            <i v-if="law.numCompetingProposals > 0" class="fa fa-fw fa-balance-scale" aria-hidden="true"></i>&nbsp;{{law.numCompetingProposals}} alternatives<br/>
          </td>
          <td class="likeButtonCell">
            <button v-if="law.supportedByCurrentUser" type="button" class="btn btn-default btn-xs active">
              <span class="fa fa-thumbs-o-up" aria-hidden="true"></span> {{law.numSupporters}}
            </button>
            <button v-else type="button" class="btn btn-default btn-xs" v-on:click="likeToDiscuss(law)">
              <span class="fa fa-thumbs-o-up" aria-hidden="true"></span> {{law.numSupporters}}
            </button>
          </td>
          <td class="gotoPollCell">
            <router-link v-if="showGotoPoll" :to="{ path: '/poll', query: { proposal: this.getLawURI() }}" role="button" class="btn btn-default btn-xs">
              &nbsp;Goto poll &raquo;
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
/*
  A lawPanel shows one idea, proposal or law.
  It shows three rows: title, description with timeline and some attributes in the footer.

 */
import moment from 'moment'
import timeline from './Timeline'   // timeline component

export default {
  props: { 
    'law' : { type: Object, required: true },
    'showTimeline' : { type: Boolean, required: false, default: function() { return true } },
    'showGotoPoll' : { type: Boolean, required: false, default: function() { return false } },
  },

  components: {'timeline': timeline },

  methods: {
    getFromNow: function(dateVal) {
      return moment(dateVal).fromNow();
    },
    
    // dynamically set icon depending on law.status
    getIconFor: function(law) {
      return {
        "fa-lightbulb-o": law.status == "IDEA",
        "fa-file-text-o": law.status == "PROPOSAL",
        "fa-university":  law.status == "LAW"
      }
    },
    
    likeToDiscuss(law) {
      //console.log("User "+this.$root.currentUser.email+", likes to discuss '"+idea.title+"'")
      this.$root.api.addSupporter(law, this.$root.currentUser).then(res => {
        //BUGFIX:  cannot simply update this.law, becasue Vue properties should not be updated. So we fire an event to parent instead:
        this.$emit("reloadLaw", law)  // notify parent to reload this law
      })
    },

    getTimelineDataFor(law) {
      var now = new Date().getTime()
      var createdMs = new Date(law.createdAt).getTime()
      var createdLoc = moment(law.createdAt).format('L')
      console.log(law)
      var elaborationStartsLoc = moment(law.elaborationStartsAt).format('L')
      var quorumReachedLoc     = moment(law.reachedQuorumAt).format('L')
      var votingStartsLoc      = moment(law.votingStartsAt).format('L')
      var votingEndsLoc        = moment(law.votingEndsAt).format('L')
      var timeForVoting = 30 * 24*3600*1000  // days in ms    //TODO: load timeForVoting from server (from profile)
      var percentFilled = ((now-createdMs) / timeForVoting)*100
      //console.log((now-created)/1000+"sec since created", (now-created) / timeForVoting)
      var timelineData = {}
      if (law.initialProposal) {
      	timelineData = {
	        percentFilled: percentFilled,
	        events: [ 
	          { percent:  "0",  above: elaborationStartsLoc, below: "Initial<br/>created" },
	          { percent: "30",  above: quorumReachedLoc, below: "Quorum<br/>reached"},
	          { percent: "45",  above: votingStartsLoc, below: "Voting<br/>starts"},
	          { percent: "100", above: votingEndsLoc, below: "Voting<br/>ends"}
	        ]
	      }
      } else {
      	timelineData = {
	        percentFilled: percentFilled,
	        events: [ 
	          { percent:  "0",  above: elaborationStartsLoc, below: "Elaboration<br/>starts" },
	          { percent: "15",  above: createdLoc, below: "Proposal<br/>created" },
	          { percent: "30",  above: quorumReachedLoc, below: "Quorum<br/>reached"},
	          { percent: "45",  above: votingStartsLoc, below: "Voting<br/>starts"},
	          { percent: "100", above: votingEndsLoc, below: "Voting<br/>ends"}
	        ]
	      }
      }
      return timelineData
    },

    getLawURI() {
      return this.$root.api.getURI(this.law)
    }
  }
}
</script>

<style scoped>
  .lawIcon {
  	font-size: 20px;
  }
  .lawTitle {
    margin-top: 0;
    margin-bottom: 0;
  }
  .lawDescription {
    /*background:  #fcfcfc;*/
  }
  .lawFooterTable {
    background: #f5f5f5;
  }
  .lawFooterTable td {
    padding: 3px 8px;
  }
  .likeButtonCell {
    vertical-align: middle;
  }
  .gotoPollCell {
    text-align: right;
    vertical-align: middle;
  }
</style>
