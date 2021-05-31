"use strict";

const _ = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const pointsByWin = (match, bet) => {
  const betDiff = bet.localScore - bet.visitingScore;
  const matchDiff = match.localScore - match.visitingScore;
  if (
    (betDiff > 0 && matchDiff > 0) ||
    (betDiff < 0 && matchDiff < 0) ||
    (betDiff === 0 && matchDiff === 0)
  ) {
    return 2;
  }
  return 0;
};

const pointsByExactMatch = (match, bet) => {
  if (
    match.localScore === bet.localScore &&
    match.visitingScore === bet.visitingScore
  ) {
    return 5;
  }
  return 0;
};

module.exports = {
  lifecycles: {
    async afterUpdate(match, params, data) {
      // retrieve all match groups
      const groups = await strapi
        .query("group")
        .find({ competition_in: [match.competition.id] });
      // retrieve all group bets
      const soccerBetsPromises = groups.map((g) =>
        strapi
          .query("soccer-bet")
          .find({ group_in: [g.id], match_in: [match.id] })
      );
      const soccerBets = await Promise.all(soccerBetsPromises);
      // update bets
      const updatePromises = _.flatten(soccerBets).map((soccerBet) => {
        const bet_points =
          pointsByWin(match, soccerBet) + pointsByExactMatch(match, soccerBet);
        return strapi
          .query("soccer-bet")
          .update({ id: soccerBet.id }, { bet_points });
      });
      return await Promise.all(updatePromises);
    },
  },
};
