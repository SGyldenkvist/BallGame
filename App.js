import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Canvas, Rect, Circle } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { useRef, useState, useEffect } from 'react';

//Skia = grafikken
//Matters.js = fysikken

export default function App() {

  const physics = useRef(null);


  const [ballPosition, setBallPosition] = useState({x: 150, y: 250,});


  if (physics.current === null){

  //Opret fysikmotoren med tyngdekraft som standard:
  const engine = Matter.Engine.create();

  //Kuglen, x, y-position ogkuglens radius (og så den hopper lidt):
  const ball = Matter.Bodies.circle(150, 400, 25, {
    restitution: 0.8,
  });

  //Lav et gulv der ikke flytter sig når kuglen rammer det:
  const ground = Matter.Bodies.rectangle(150, 490, 300, 20, {
    isStatic: true,
   });

  //loft:
  const ceiling = Matter.Bodies.rectangle(150, 10, 300, 20, {
    isStatic: true,
  });

  //venstre væg:
  const leftWall = Matter.Bodies.rectangle(10, 250, 20, 500, {
   isStatic: true,
  });

  //H væg:
  const rightWall = Matter.Bodies.rectangle(290, 250, 20, 500, {
   isStatic: true,
  });


  //Platformen:
  const platform = Matter.Bodies.rectangle(150, 300, 120, 15, {
    isStatic: true,
  });

  //Sæt dem sammen:
  Matter.Composite.add(engine.world, [ball, ground, ceiling, leftWall, rightWall, platform,]);

  physics.current = { engine, ball};

  }
  



  useEffect(() => {
    const { engine, ball } = physics.current;

    const interval = setInterval(() => {
      Matter.Engine.update(engine, 1000 /60);

      setBallPosition({
        x: ball.position.x,
        y: ball.position.y,
      });
    }, 1000 / 60);

    return () => clearInterval(interval);

  }, []);




  const jump = () => {
    const { ball } = physics.current;

    Matter.Body.setVelocity(ball, {
      x: ball.velocity.x,
      y: -12,
    });
  };



  const moveLeft = () => {
    const {ball} = physics.current;

    Matter.Body.setVelocity(ball, {
      x: -5,
      y: ball.velocity.y,
    });
  };

  const moveRight = () => {
    const {ball} = physics.current;

    Matter.Body.setVelocity(ball, {
      x: 5,
      y: ball.velocity.y,
    });

  };
  


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Canvas style={{ width: 300, height: 500 }}>
        <Rect x={0} y={0} width= {300} height={500} color="lightblue"/>
        
        <Rect x={0} y={480} width={300} height={20} color="darkblue" />
        <Rect x={0} y={0} width={300} height={20} color="darkblue"/>
        <Rect x={0} y={0} width={20} height={500} color="darkblue"/>
        <Rect x={280} y={0} width={20} height={500} color="darkblue" />

        
        <Rect x={90} y={292.5} width={120} height={15} color="green"/>

        <Circle cx={ballPosition.x} cy={ballPosition.y} r={25} color="red"/>
      </Canvas>
      
      
      <View style={{ flexDirection: 'row', gap: 10}}>
        <Button title="← Venstre" onPress={moveLeft} />
        <Button title="↑ Hop!" onPress={jump}/>
        <Button title="→ Højre" onPress={moveRight} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
