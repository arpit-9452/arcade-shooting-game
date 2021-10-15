// Importing Sounds Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio ("./music/hugeWeapon.wav");


introMusic.play();

const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
const hugeWeaponDamage = 50;
let dificulty = 2;
const form = document.querySelector("form");
const scoreboard = document.querySelector(".scoreboard");
let playerScore = 0;

//Basic FUNCTION----------------------------
//Event Listoner for dificulty

document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();

    //Stoping Music 
    introMusic.pause();

    form.style.display = "none";
    scoreboard.style.display = "block"

    const uservalue = document.getElementById("dificulty").value;

    if (uservalue === "Easy") {
        setInterval(spawnEnemy, 2000);
        return (dificulty = 2);
    }
    if (uservalue === "Medium") {
        setInterval(spawnEnemy, 1400);
        return (dificulty = 8);
    }
    if (uservalue === "Hard") {
        setInterval(spawnEnemy, 1000);
        return (dificulty = 10);
    }

    if (uservalue === "Insane") {
        setInterval(spawnEnemy, 700);
        return (dificulty = 12);
    }
});

//EndScreen--
const gameoverLoader = () => {
    // Creating End Screen div and play again button and high score element
    const gameOverBanner =  document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    highScore.innerText = `High Score : ${
        localStorage.getItem("highScore")
        ? localStorage.getItem("highScore")
        : playerScore
    }` ;

    const oldHighScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");

    if (oldHighScore < playerScore) {
        localStorage.setItem("highScore", playerScore)

        //updating high score html
        highScore.innerHTML = `High Score : ${playerScore}`;
    };



    //adding text to play again button
    gameOverBtn.innerText = "Play Again";

    gameOverBanner.appendChild(highScore);

    gameOverBanner.appendChild(gameOverBtn);

    //Making reload on click playing again button
    gameOverBtn.onclick = () => {
        window.location.reload();
    }
    gameOverBanner.classList.add("gameover")
    document.querySelector("body").appendChild(gameOverBanner);
};

//Making Class of Palyer and Ememy--------------s
playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
    }
}
/*------------------------Weapon-------------------------------*/

class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        (this.x += this.velocity.x), (this.y += this.velocity.y);
    }
}

/*---------------------Mega---Weapon-------------------------------*/

class HugeWeapon {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.color = "rgba(255,255,0,0)";
        this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.fillRect(this.x, this.y, 200, canvas.height);
        context.fillStyle = this.color;
    }

    update() {
        this.draw();
        (this.x += 20);
    }
}


/*------------------------Weapon-------------------------------*/

/*-------------------------Enemy---------------------------------------*/

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        (this.x += this.velocity.x), (this.y += this.velocity.y);
    }
}

//------------------------------------------Creating Partical Class---------------------------
const fiction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= fiction;
        this.velocity.y *= fiction;

        (this.x += this.velocity.x), (this.y += this.velocity.y);
        this.alpha -= 0.01;
    }
}


//Main Logic---------------------------



const arpit = new Player(
    playerPosition.x,
    playerPosition.y,
    15,
    `rgb(${Math.random() * 250},${Math.random() * 250}, ${Math.random() * 250})`
);

const weapons = [];
const enemies = [];
const particles = [];
const hugeWeapons = [];

const spawnEnemy = () => {

    const enemySize = Math.random() * (40 - 5) + 5;
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

    let random;

    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        }
    }
    else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
        }
    }

    const myAngle = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x
    );
    const velocity = {
        x: Math.cos(myAngle) * dificulty,
        y: Math.sin(myAngle) * dificulty,
    }

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

//-------------------------------Making Animation Function-------------->


let animationId;
function animation() {
    animationId = requestAnimationFrame(animation);

    //UPdating Player Score in Score Board
    scoreboard.innerHTML = `Score : ${playerScore}`;


    //claering  canvas on Each frame
    context.fillStyle = "rgba(49, 49, 49, 0.2)"
    context.fillRect(0, 0, canvas.width, canvas.height)
    //Drwaing Player
    arpit.draw();

    //Generating Partcles
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update()
        }
    });

    // Generating Huge Weapons-----
    hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
            hugeWeapons.splice(hugeWeaponIndex, 1);
        } else {
            hugeWeapon.update();
        }

    })

    //Generating Enimies
    weapons.forEach((weapon, weaponIndex) => {
        weapon.update();

        //Removing Weapons idf they are off screen----------
        if (
            weapon.x + weapon.radius < 1 ||
            weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height
        ) {
            weapons.splice(weaponIndex, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        //--------Find distance between Player and enemy

        const distanceBetweenPlayerAndEnemy = Math.hypot(
            arpit.x - enemy.x,
            arpit.y - enemy.y
        );

        // Stoping the game if enemy hit the player---------
        if (distanceBetweenPlayerAndEnemy - arpit.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);
            gameOverSound.play();
            return gameoverLoader();
        }

        hugeWeapons.forEach((hugeWeapon) => {
            const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;
            console.log(distanceBetweenHugeWeaponAndEnemy)
            if (
                distanceBetweenHugeWeaponAndEnemy <= 200 &&
                distanceBetweenHugeWeaponAndEnemy >= -200
            ) {
                // INcrwsing player score When Killing enemy
                playerScore += 10;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex, 1)
                }, 0);
            }
        });


        weapons.forEach((weapon, weaponIndex) => {
            //Finding the distance between weapon and enemy

            const distanceBetweenWeaponAndEnemy = Math.hypot(weapon.x - enemy.x, weapon.y - enemy.y);

            if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {


                //------reducing size of enemy if hit
                if (enemy.radius > weapon.damage + 8) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage,
                    });
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 0)
                }
                //----------Removing  enemy on hit if they are below 18
                else {

                    for (let i = 0; i < enemy.radius * 5; i++) {
                        particles.push(
                            new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                                x: (Math.random() - 0.5 * Math.random() * 7),
                                y: (Math.random() - 0.5 * Math.random() * 7),
                            })
                        );
                    }
                    // INcrwsing player score When Killing enemy
                    playerScore += 10;
                    //Rendering Player Score in score borad on HTML-----------------
                    scoreboard.innerHTML = `Score : ${playerScore}`;
                  

                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0)
                }
            }
        })


    });
}

// Event Listner for light weapon--------------
canvas.addEventListener("click", (e) => {

    shootingSound.play();

    //Finding angle betwen player and position and click co-oridinates
    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);

    const velocity = {
        x: Math.cos(myAngle) * 6,
        y: Math.sin(myAngle) * 6,
    }


    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 6, "white", velocity, lightWeaponDamage));
});

// Event listner for Heavy Weapon-------------

canvas.addEventListener("contextmenu", (e) => {

    e.preventDefault();

   

    if (playerScore <=0 ) return;
    heavyWeaponSound.play();
    // Decressing the player Score for using Heavy Weapon
    playerScore -=2;
    //Updating Player Score oin borad  in HTMl
    scoreboard.innerHTML = `Score : ${playerScore}`;

    // finding angle betweeen player position and CLick
    const myAngle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);

    const velocity = {
        x: Math.cos(myAngle) * 4,
        y: Math.sin(myAngle) * 4,
    }

    weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 30, "cyan", velocity, heavyWeaponDamage));
});

addEventListener("keypress", (e) => {
    if (e.key === " ") {

        if (playerScore < 20 ) return;
        // Decressing the player Score for using Hugey Weapon
        playerScore -= 20;
        //Updating Player Score oin borad  in HTMl
        scoreboard.innerHTML = `Score : ${playerScore}`;
        hugeWeaponSound.play();
        hugeWeapons.push(new HugeWeapon(0, 0, hugeWeaponDamage))
    };
});

addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

addEventListener("resize", () => {
   window.location.reload();
})


animation();

// All working fine at 2:00:00-----------------------

