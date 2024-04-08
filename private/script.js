let hitboxes = {};
let playerHitBox = {};
let discarededShooters = [];
const int = parseFloat;



function randomBullet() {
  let bulletList = ['black','white','rainbow','pink'];
  const random = Math.floor(
    Math.random() * bulletList.length
  );

  const bulletRand = bulletList[random];
  return(`../resources/cupcake-sprite/` + bulletRand + '.png');
}
class Vector2 {
  constructor({ XstartingValue, XendingValue }, {  YstartingValue, YendingValue }, aria){
    this.XstartingValue = XstartingValue;
    this.YstartingValue = YstartingValue;
    this.XendingValue = XendingValue;
    this.YendingValue = YendingValue

    
  }

  rectAriaCheck(Object2D, fn) {
    Object2D = Object2D.style;
    if(
      int(Object2D.right) < int(this.XendingValue)
       &&
      int(Object2D.right) > int(this.XstartingValue)
      &&
      int(Object2D.top) < int(this.YendingValue)
      &&
      int(Object2D.top) > int(this.YstartingValue)
      ) {
        fn(Object2D)
    }
}

}



let Level = 250;
let restrictedBulletArias = [];
class Bullet {
    constructor(shooter, type) {
        this.bullet = document.createElement('img');
        this.bullet.src = type? '../resources/bullet.png' :randomBullet();
        this.bullet.style.aspectRatio = '1/1';
        this.bullet.style.width = '60px';
        this.bullet.style.position = 'absolute';
        this.bullet.style.top = type? type:'75%';
        this.bullet.style.right = shooter.style.right
    }

    build() {
      return document.body.appendChild(this.bullet)
    }

    discard() {
      try {
        return document.body.removeChild(this.bullet)
      }catch {
        
      }
    }


}

class Shooter { 
   constructor() {
    this.shooter = document.createElement('img');
    this.shooter.src = '../resources/shooter.png';
    this.shooter.style.aspectRatio = '1/ 1';
    this.shooter.style.width = '120px';
    this.shooter.style.top = '80%';
    this.shooter.style.position = 'absolute';
    this.shooter.style.right = '50%';
    this.shooter.id = 'shooter'
   } 

   build() {
    return document.body.appendChild(this.shooter);
   }

   shoot(invaderPacket, fn) {
     const madeBullet = new Bullet(this.shooter);
     madeBullet.build()
     const animation = Animate(40, () => {
        if(madeBullet.bullet.style.top === '0%') {
            madeBullet.discard();
            return clearInterval(animation)
        }
        madeBullet.bullet.style.top = parseInt(madeBullet.bullet.style.top) - 1 + '%';
         const hitboxValues = Object.values(hitboxes);
        
        hitboxValues.forEach((e,i) => {
      
          const vector = new Vector2({
            XstartingValue: e["e-right"],
            XendingValue: e["s-right"]
          }, {
            YstartingValue: e["s-top"],
            YendingValue: e["e-top"]
          });

          vector.rectAriaCheck(madeBullet.bullet, () =>{
          
          let invader = invaderPacket.generatedInvaders.at(
            int(e["s-right"].toString()[0]) -1
          )
        
           
          if(invader) invader.discard();
         discarededShooters.includes(e["s-right"].toString()[0] -1)? discarededShooters.push(e["s-right"].toString()[0] -1): 0;
          
          })

          
        })
          
        
      })
   }

   discard() {
    try {
    return document.body.removeChild(this.shooter);
    }catch { 

    }
   }
}

class Invader {
   constructor() {
    this.invader = document.createElement('img');
    this.invader.src = '../resources/invader.png';
    this.invader.style.aspectRatio = '1/ 1';
    this.invader.style.width = '120px';

   }

   build() {
     return document.body.appendChild(this.invader)
   }

   discard() {
    try {
       return document.body.removeChild(this.invader)
    }catch{ 
      return null
    }
   }

   shoot(shooter, shooterRectDetect) {
      const bullet = new Bullet(this.invader, int(this.invader.style.top) + 5 + '%');
      bullet.build();
      const animator = Animate(40, () => {
        if(bullet.bullet.style.top === '93%') {
          bullet.discard();
          return cancelAnimationFrame(animator)
        }

        bullet.bullet.style.top = parseInt(bullet.bullet.style.top) + 1 + '%';
        const vector = new Vector2({
           XstartingValue: playerHitBox["s-right"],
           XendingValue: playerHitBox["e-right"]
        }, {
          YstartingValue: playerHitBox['s-top'],
          YendingValue: playerHitBox['e-top']
        });

        vector.rectAriaCheck(bullet.bullet, () => {
          shooterRectDetect.discard();
          Die()
        })
      })
   }
}

class InvaderPacket {
   constructor() {
    this.packet =  document.createElement('div');



    const generatedInvaders = [];
    for(let i = 0;i<8;i++) {
        generatedInvaders.push(
            new Invader()
        )

    }

       let startingRight = 10;
      generatedInvaders.forEach((e, i) => {
        e.invader.style.top = '20%';
        e.invader.style.position = 'absolute';
        e.invader.style.right = startingRight + '%';
        startingRight += 10;


       
        
        e.build();
        hitboxes[`invader_${i}`] = {};
        const hitboxCurrent = hitboxes[`invader_${i}`];
        hitboxCurrent["s-top"] = int('20%');
        hitboxCurrent["e-top"] = int('27%');
        hitboxCurrent["e-right"] = startingRight
        hitboxCurrent["s-right"] = startingRight + 5;
        
        let InvaderDate = 0;
        setInterval(() => { 
          
        }, 
        (() => {
          Level > 750? 1000: 300
        })())
      })
      
  
      this.generatedInvaders = generatedInvaders
   }
     refillInvaders() {
      let oldPacket = this.generatedInvaders; 
      this.generatedInvaders.forEach((e) => { e.discard() });
      oldPacket.forEach((e) => {
        e.build();
        document.body.appendChild(e.invader)
      }) 
         discarededShooters.forEach(() => discarededShooters.shift())
    }
    
    build() {
        return document.body.appendChild(this.packet)
    }

    shoot(invaderIndex, shooter) {
      this.generatedInvaders.at(invaderIndex).shoot(shooter)
    }
}



function Animate(fps, fn) {
   return setInterval(() => {
     fn()
   }, 1000 /fps)
}

function Die() {
   Level += 250;
   shooter.discard();
   window.location.replace('/private/lost.html');
}

const shooter = new Shooter();
shooter.build()


function MovePlayer() {
    let Mover = 'right';
     let OldRight = parseInt(shooter.shooter.style.right)
    const animator = Animate(60, () => {
   
        if(Mover === 'right') {
          if(OldRight < 5) {
             Mover = 'left';
          }
           OldRight = OldRight - .7
          shooter.shooter.style.right = OldRight + '%';
         
        }else {
            
            if(OldRight > 85) {
                Mover = 'right';
             }
              OldRight = OldRight + .7
             shooter.shooter.style.right = OldRight + '%';
        }

        playerHitBox = {
          "s-right": int(shooter.shooter.style.right),
          "e-right": int(shooter.shooter.style.right) + 10,
          "s-top": 80,
          "e-top": 90
         }


    })
}
MovePlayer();
const invaderPacket = new InvaderPacket();
invaderPacket.build();
let died = 0;
window.addEventListener('keydown', (e) => {
    if(e.keyCode === 32) {
        setTimeout(() => {
            shooter.shoot(invaderPacket)
        }, Level)
        
    }
})

setInterval(() => {
 invaderPacket.refillInvaders();
 Level += 250
}, 10000)

function range(int1, int2) {
  let ints = [];
  for(let i = int1;i<int2;i++) {
     ints.push(i)
  }

  return ints;
}



function invaderShoot() {
  const { generatedInvaders } = invaderPacket
  generatedInvaders.forEach((e, i) => {
    const chances = [true, false];
    const timeSpace = range(1000, 1500);
    const time = timeSpace[
      Math.floor(Math.random() * timeSpace.length)
    ]
    const chance = chances[
      Math.floor(
        Math.random() * chances.length
      )
    ];
    console.log(!discarededShooters.includes(i))
    if(chance) setTimeout(() => {if(chance) {if(!discarededShooters.includes(i)){ e.shoot(i, shooter)}}} , time)
  })
}
const timeSpace = range(4000, 8000);
const time = timeSpace[
  Math.floor(Math.random() * timeSpace.length)
]
setInterval(() => {invaderShoot()}, time)