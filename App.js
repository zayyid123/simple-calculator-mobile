import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from "nativewind";
import { LinearGradient } from 'expo-linear-gradient'

// svg
import { useState } from 'react';

// function
const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const math = (a, b, sign) =>
  sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const zeroDivisionError = "Can't divide with 0";

export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [history, sethistory] = useState('')
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });

  const numClickHandler = (value) => {
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const comaClickHandler = (value) => {
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (value) => {
    setCalc({
      ...calc,
      sign: value,
      res: !calc.num
        ? calc.res
        : !calc.res
        ? calc.num
        : toLocaleString(
            math(
              Number(removeSpaces(calc.res)),
              Number(removeSpaces(calc.num)),
              calc.sign
            )
          ),
      num: 0,
    });
  };

  const equalsClickHandler = async() => {
    if (calc.sign && calc.num) {
      await sethistory(`${calc.res} ${calc.sign} ${calc.num}`)
      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? zeroDivisionError
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
        sign: "",
        num: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    sethistory('')
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  const buttonClickHandler = (value, btn) => {
    btn === "C" || calc.res === zeroDivisionError
    ? resetClickHandler()
    : btn === "+-"
    ? invertClickHandler()
    : btn === "%"
    ? percentClickHandler()
    : btn === "="
    ? equalsClickHandler()
    : btn === "/" || btn === "X" || btn === "-" || btn === "+"
    ? signClickHandler(value)
    : btn === "."
    ? comaClickHandler(value)
    : numClickHandler(value)
  }

  return (
    <LinearGradient
      colors={[colorScheme === 'dark' ? '#fff' : '#353D45', colorScheme === 'dark' ? '#EBECF1' : '#353D45']}
      className={`flex-1 items-center justify-center relative`}
    >
      {/* status bar */}
      <StatusBar style={colorScheme} backgroundColor={colorScheme === 'dark' ? '#fff' : '#afafaf'}/>

      {/* toggle dark mode */}
      <TouchableOpacity
        style={{
          shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
        }}
        className={`${colorScheme === 'dark' ? 'bg-[#e8f9c5]' : 'bg-[#e8e8e8]'} shadow-lg absolute top-12 px-6 py-2 rounded-full`}
        onPress={toggleColorScheme}
      >
        <View>
          {
            colorScheme === 'dark' ?
            <Image source={require('./assets/night-mode.png')} className='w-[25px] h-[25px]'/>
            :
            <Image source={require('./assets/sleep-mode.png')} className='w-[25px] h-[25px]'/>
          }
        </View>
      </TouchableOpacity>
      
      {/* content */}
      <View
        className='w-full absolute bottom-0'
      >
        {/* screeen */}
        <View
          className='mb-5 items-end mx-7'
        >
          {/* perhitungan */}
          <View
            className='mb-5 flex-row'
          >
            <Text 
              className={`${colorScheme === 'dark' ? 'text-[#5E6970]' : 'text-white'} text-lg ml-1`}
            >
              {history !== '' && history}
            </Text>
          </View>

          {/* hasil */}
          <View
            className='flex-row items-center'
          >
            <Text
              className={`${colorScheme === 'dark' ? 'text-[#5E6970]' : 'text-white'} ml-3 text-5xl font-bold`}
            >
              {calc.num ? calc.num : calc.res}
            </Text>
          </View>
        </View>

        {/* btn */}
        <View
          style={{
            shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
          }}
          className={`${colorScheme === 'dark' ? 'bg-[#E7E9EF]' : 'bg-[#313941]'} shadow-lg rounded-t-3xl p-7`}
        >
          <View
            className='flex-row justify-between items-center mb-4'
          >
            {/* AC */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#D3A44D]' : 'bg-[#F2BB4D]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('C', 'C')
              }}
            >
              <Text
                className='text-white text-lg font-bold'
              >
                AC
              </Text>
            </TouchableOpacity>

            {/* +- */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#EFE9DF]' : 'bg-[#3F4040]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('+-', '+-')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#c5b183]' : 'text-[#EDB74C]'} text-lg font-bold`}
              >
                +-
              </Text>
            </TouchableOpacity>

            {/* % */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#EFE9DF]' : 'bg-[#3F4040]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('%', '%')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#c5b183]' : 'text-[#EDB74C]'} text-lg font-bold`}
              >
                %
              </Text>
            </TouchableOpacity>

            {/* / */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#FFE1DF]' : 'bg-[#59464A]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('/', '/')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#FE392E]' : 'text-[#F69E99]'} text-lg font-bold`}
              >
                /
              </Text>
            </TouchableOpacity>
          </View>
          

          <View
            className='flex-row justify-between items-center mb-4'
          >
            {/* 7 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('7', '7')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                7
              </Text>
            </TouchableOpacity>

            {/* 8 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('8', '8')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                8
              </Text>
            </TouchableOpacity>

            {/* 9 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('9', '9')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                9
              </Text>
            </TouchableOpacity>

            {/* x */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#FFE1DF]' : 'bg-[#59464A]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('X', 'X')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#FE392E]' : 'text-[#F69E99]'} text-lg font-bold`}
              >
                x
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className='flex-row justify-between items-center mb-4'
          >
            {/* 4 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('4', '4')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                4
              </Text>
            </TouchableOpacity>

            {/* 5 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('5', '5')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                5
              </Text>
            </TouchableOpacity>

            {/* 6 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('6', '6')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                6
              </Text>
            </TouchableOpacity>

            {/* - */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#FFE1DF]' : 'bg-[#59464A]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('-', '-')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#FE392E]' : 'text-[#F69E99]'} text-lg font-bold`}
              >
                -
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className='flex-row justify-between items-center mb-4'
          >
            {/* 1 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('1', '1')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                1
              </Text>
            </TouchableOpacity>

            {/* 2 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('2', '2')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                2
              </Text>
            </TouchableOpacity>

            {/* 3 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('3', '3')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                3
              </Text>
            </TouchableOpacity>

            {/* + */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#FFE1DF]' : 'bg-[#59464A]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('+', '+')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#FE392E]' : 'text-[#F69E99]'} text-lg font-bold`}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className='flex-row justify-between items-center mb-4'
          >
            {/* 0 */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('0', '0')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                0
              </Text>
            </TouchableOpacity>

            {/* . */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className={`${colorScheme === 'dark' ? 'bg-[#E2E6EF]' : 'bg-[#363E45]'} min-w-[68px] py-4 rounded-full shadow items-center`}
              onPress={() => {
                buttonClickHandler('.', '.')
              }}
            >
              <Text
                className={`${colorScheme === 'dark' ? 'text-[#586370]' : 'text-[#fff]'} text-lg font-bold`}
              >
                .
              </Text>
            </TouchableOpacity>

            {/* = */}
            <TouchableOpacity
              style={{
                shadowColor: `${colorScheme === 'dark' ? '#000' : '#fff'}`,
              }}
              className='bg-[#FE392E] w-[50%] py-4 rounded-full shadow items-center'
              onPress={() => {
                buttonClickHandler('=', '=')
              }}
            >
              <Text
                className='text-[#fff] text-lg font-bold'
              >
                =
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}