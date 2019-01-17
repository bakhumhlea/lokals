export const getOpeningStatus = (hours) => {
  const now = new Date(Date.now());
  const d = now.getDay();
  const h = now.getHours().toString();
  const m = now.getMinutes() < 10 ? `0${now.getMinutes().toString()}` : now.getMinutes().toString();
  const currenttime = parseInt(h+m, 10);
  var text = "Close";
  var status = false;
  var opendayIndex = [];
  if (hours) {
    const openday = hours.map(h => h.open.day);
    if (openday.includes(d)) {
      openday.forEach((el, i) => { if (el === d) opendayIndex.push(i) });
      opendayIndex.forEach(el => {
        const opentime = parseInt(hours[el].open.time, 10);
        const closetime = parseInt(hours[el].close.time, 10) === 0 ? 2400 : parseInt(hours[el].close.time, 10);
        // console.log(currenttime);
        // console.log(opentime);
        // console.log(closetime);
        if (opentime <= currenttime && currenttime <= closetime) {
          text = "Open";
          status = true;
        } else if (0 < (closetime - currenttime) && (closetime - currenttime) < 70) {
          text = `Close in ${closetime - currenttime - 40}m`;
          status = true;
        } else {
          if (currenttime < opentime && (opentime - currenttime) < 100 && (opentime - currenttime) > 60) {
            text = `Open in ${opentime - currenttime - 40}m`;
          } else if (currenttime < opentime && (opentime - currenttime) < 60 && (opentime - currenttime) > 60) {
            text = `Open in ${opentime - currenttime}m`;
          }
        }
      });
      return {
        text: text,
        status: status,
      };
    } 
  }
  return {
    text: "Close Today",
    status: false,
  };
};

export const getOpeninghoursString = (hour) => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const formatTime = (time) => {
    if (time.length === 3) {
      return `${time.charAt(0)}:${time.substr(1)}`;
    } else {
      return `${time.substr(0,2)}:${time.substr(2)}`;
    }
  }
  return `${days[hour.open.day]} ${formatTime(hour.open.time)} - ${formatTime(hour.close.time)}`;
}