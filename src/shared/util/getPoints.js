const getPoints = (sprint, race, flap, isSprint, isHalfPoints) => {

    const sprintPoints = GetSprintPoints(sprint, isSprint);
    const racePoints = GetRacePoints(race);
    const flapPoints = GetflapPoints(race, flap);

    let totalPoints;
    if (isHalfPoints) {
      totalPoints = sprintPoints + ( racePoints / 2 ) + flapPoints;
    } else {
      totalPoints = sprintPoints + racePoints + flapPoints;
    }

    return totalPoints;
};

const GetSprintPoints = (position, sprint) => {

  let points;
  if(sprint == true){
    switch(position) {
      case 1:
        points = 8
        break;
      case 2:
        points = 7
        break;
      case 3:
        points = 6
        break;
      case 4:
        points = 5
        break;
      case 5:
        points = 4
        break;
      case 6:
        points = 3
        break;
      case 7:
        points = 2
        break;
      case 8:
        points = 1
        break;
      default:
        points = 0
    }
  } else {
    points = 0;
  }

    return points;
}

const GetRacePoints = (position) => {

  let points;
      switch(position) {
        case 1:
          points = 25
          break;
        case 2:
          points = 18
          break;
        case 3:
          points = 15
          break;
        case 4:
          points = 12
          break;
        case 5:
          points = 10
          break;
        case 6:
          points = 8
          break;
        case 7:
          points = 6
          break;
        case 8:
          points = 4
          break;
        case 9:
          points = 2
          break;
        case 10:
          points = 1
          break;
        default:
          points = 0
      }

  return points;
}

const GetflapPoints = (position, flap) => {

  let points;
  if (flap == true){
    if(position > 0 && position <= 10) {
      points = 1;
    } else {
      points = 0;
    }
  } else {
    points = 0;
  }

  return points;
}

module.exports = getPoints;