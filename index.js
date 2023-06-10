class Game {
  currentPoints = 999;
  pointsPerClick = 1;
  autoPointsPerSec = 0;

  autoClickIntervalId = 0;
  screenList = ["game-start-screen", "game-screen", "game-end-screen"];

  upgrades = {
    perClick: {
      current: -1,
      levels: [
        {
          cost: 20,
          value: 2,
        },
        {
          cost: 100,
          value: 4,
        },
        {
          cost: 200,
          value: 8,
        },
        {
          cost: 300,
          value: 12,
        },
        {
          cost: 400,
          value: 18,
        },
      ],
    },
    perSecond: {
      current: -1,
      levels: [
        {
          cost: 20,
          value: 1,
        },
        {
          cost: 40,
          value: 4,
        },
        {
          cost: 80,
          value: 10,
        },
        {
          cost: 111,
          value: 16,
        },
        {
          cost: 160,
          value: 20,
        },
      ],
    },
  };

  constructor() {
    document.getElementById("click-button").addEventListener("click", () => {
      this.setPoints(this.currentPoints + this.pointsPerClick);
    });

    document
      .getElementById("perClick-upgrade-button")
      .addEventListener("click", () => {
        const nextUpgradeIndex = this.upgrades.perClick.current + 1;
        const nextUpgrade = this.upgrades.perClick.levels[nextUpgradeIndex];

        if (this.currentPoints < nextUpgrade.cost) {
          return;
        }
        this.setPoints(this.currentPoints - nextUpgrade.cost);

        this.pointsPerClick = nextUpgrade.value;
        this.playAudio("sound-sfx", "./sounds/yeah.mp3");
        this.upgrades.perClick.current++;

        this.refreshUpgradeBar();
      });

    document
      .getElementById("perSecond-upgrade-button")
      .addEventListener("click", () => {
        const nextUpgradeIndex = this.upgrades.perSecond.current + 1;
        const nextUpgrade = this.upgrades.perSecond.levels[nextUpgradeIndex];

        if (this.currentPoints < nextUpgrade.cost) {
          return;
        }

        this.setPoints(this.currentPoints - nextUpgrade.cost);

        this.setAutoClickPerTime(nextUpgrade.value);
        this.playAudio("sound-sfx", "./sounds/yeah.mp3");
        this.upgrades.perSecond.current++;

        this.refreshUpgradeBar();
      });

    document
      .getElementById("start-game-button")
      .addEventListener("click", () => {
        this.setScreen("game-screen");
        this.onGameStart();
      });

    this.setScreen("game-start-screen");
    this.setPoints(this.currentPoints);
    this.refreshUpgradeBar();
  }

  onGameStart() {
    this.playAudio("sound-music", "./sounds/music.mp3");
  }

  onGameEnd() {
    clearInterval(this.autoClickIntervalId);
    this.setScreen("game-end-screen");
    this.playAudio("sound-music", "./sounds/congratulations.mp3");
  }

  refreshUpgradeBar() {
    Object.keys(this.upgrades).forEach((upgrade) => {
      const nextUpgradeIndex = this.upgrades[upgrade].current + 1;
      const nextUpgrade = this.upgrades[upgrade].levels[nextUpgradeIndex];

      const currentUpgradeIndex = this.upgrades[upgrade].current;
      const currentUpgrade = this.upgrades[upgrade].levels[currentUpgradeIndex];

      if (currentUpgradeIndex === -1) {
        if (upgrade == "perClick") {
          document.getElementById(`${upgrade}-current-value`).innerText = "1";
        } else {
          document.getElementById(`${upgrade}-current-value`).innerText = "0";
        }
      } else {
        document.getElementById(`${upgrade}-current-value`).innerText =
          currentUpgrade.value;
      }

      if (!nextUpgrade) {
        document.getElementById(`${upgrade}-upgrade-button`).innerText = "MAX";
        document.getElementById(`${upgrade}-upgrade-button`).disabled = true;
        return;
      }

      document.getElementById(`${upgrade}-nextupgrade-costs`).innerText =
        nextUpgrade.cost;

      if (this.currentPoints >= nextUpgrade.cost) {
        document.getElementById(`${upgrade}-upgrade-button`).disabled = false;
      } else {
        document.getElementById(`${upgrade}-upgrade-button`).disabled = true;
      }
    });
  }

  setScreen(screen) {
    this.screenList.forEach((screenId) => {
      document.getElementById(screenId).style.display = "none";
    });

    document.getElementById(screen).style.display = "block";
  }

  setPoints(amout) {
    this.currentPoints = amout;
    document.getElementById("points").innerText = this.currentPoints;

    Object.keys(this.upgrades).forEach((upgrade) => {
      const nextUpgradeIndex = this.upgrades[upgrade].current + 1;
      const nextUpgrade = this.upgrades[upgrade].levels[nextUpgradeIndex];

      if (!nextUpgrade) {
        document.getElementById(`${upgrade}-upgrade-button`).innerText = "MAX";
        document.getElementById(`${upgrade}-upgrade-button`).disabled = true;
        return;
      }

      if (this.currentPoints >= nextUpgrade.cost) {
        document.getElementById(`${upgrade}-upgrade-button`).disabled = false;
      } else {
        document.getElementById(`${upgrade}-upgrade-button`).disabled = true;
      }
    });

    if (this.currentPoints >= 1000) {
      this.onGameEnd();
    }
  }

  playAudio(channel, audioPath) {
    const audio = document.getElementById(channel);
    audio.src = audioPath;
    audio.volume = 0.5;
    audio.play();
  }

  setAutoClickPerTime(pointAmout) {
    clearInterval(this.autoClickIntervalId);
    this.autoPointsPerSec = pointAmout;
    this.autoClickIntervalId = setInterval(() => {
      this.setPoints(this.currentPoints + this.autoPointsPerSec);
    }, 1000);
  }
}

new Game();
