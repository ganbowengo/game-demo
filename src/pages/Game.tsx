/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 13:50:20
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-14 00:11:16
 * @Descripttion : game
 */
import { useState } from 'react';
import { useSocket } from '../components/Socket';
import useDeepCompareEffect from 'use-deep-compare-effect';
import axios from "axios"
import { Card,Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const ENDPOINT = "http://127.0.0.1:5000";
const gameRules = [1,2,3]
const ruleReflect = {
    1: '剪刀',
    2: '石头',
    3: '布',
}

function getGameResult (): number {
    return gameRules[Math.floor(Math.random() * 3)]
}

function getRooms () {
    return axios.get(ENDPOINT + '/rooms')
}

const AIGame = () => {
    const [clientResult, setClientResult] = useState(0);
    const [aiResult, setAiResult] = useState(0);
    const [gamesResult, setGamesResult] =  useState('');
    const playGame = () => {
        const client = getGameResult()
        const ai = getGameResult()
        setClientResult(client)
        setTimeout(() => {
            setAiResult(ai)
            if(client - ai === 0) {
                setGamesResult('打平了')
            } else if (client - ai === 1 || client - ai === -2) {
                setGamesResult('大神，你赢了')
            } else {
                setGamesResult('你输了，再接再厉')
            }
        }, 30)
    }

    return (
        <div>
            <Button type="primary" onClick={() => playGame() }>开始对战</Button>
            {
                clientResult ? (<div>
                    <div>我出：{ruleReflect[clientResult]}</div>
                    <div>AI：{ruleReflect[aiResult]}</div>
                    <div>{gamesResult}</div>
                </div>) : ''
            }
        </div>
    )
}

const Game = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAIRoom, setIsAIRoom] = useState(false);
    const [rooms, setRooms] =  useState({});
    const [update, setUpdate] = useState(false);
    const [gameResult, setGameResult] = useState([])
    const [room, setRoom] = useState( {
        id: '',
        count: 0
    })
    const socket = useSocket(); 
    useDeepCompareEffect(() => {
        const fetchData = async () => {
            const result = await getRooms()
            setRooms(result.data);
            setGameResult([])
            for(let key in result.data) {
                const curr = result.data[key]
                if (curr.id === room.id) {
                    setRoom(curr)
                }
            }
        };
        fetchData();
        socket.on('roomLimit', e => {
            message.error(e + '房间人数已满')
        })
        socket.on('roomUpdate', () => {
            fetchData();
        })
        socket.on('gameServerResult', (e) => {
            setGameResult(JSON.parse(e))
        })
        return () => {
            socket.off('roomLimit');
            socket.off('roomUpdate');
            socket.off('gameServerResult');
         };
    }, [update, socket, room]);

    const createRoom = () => {
        socket.emit('createRoom', new Date().getTime()); // 发送消息
        setUpdate(!update)
    }

    const joinRoom = (e) => {
        socket.emit('joinRoom', e.id); // 发送消息
        showModal(e)
    }
    const leaveRoom =  (e) => {
        socket.emit('leaveRoom', e); // 发送消息
    }

    const startGameServer = () => {
        socket.emit('startGameServer', room.id); // 发送消息
    }

    const showModal = (e) => {
        setRoom(e)
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        leaveRoom(room.id)
    };
      
    return (
        <div>
            <h2>欢迎来到手头剪刀布游戏</h2>
            <div className='game-header'>
                <h2>Dashboard</h2>
                <div>
                    {!isAIRoom ? <Button type="primary" onClick={() => createRoom() }>新建房间</Button> : ''}
                    <Button type="dashed" onClick={() => {setIsAIRoom(!isAIRoom)} }>{!isAIRoom ? 'AI对战' : '返回大厅'}</Button>
                </div>
            </div>
            {!isAIRoom 
            ? (<div className='game-rooms'>
                {
                    Object.keys(rooms).length ? Object.keys(rooms).map(key => (
                        <Card title={'房间号：' + key} key={key} extra={
                            <div>
                                <Button type="primary" onClick={() => joinRoom(rooms[key]) }>进入房间</Button>
                            </div>} 
                            style={{ width: 300 }}>
                            <p>{key}</p>
                            <p>人数:{rooms[key].count}</p>
                        </Card>
                    )) : <div>
                        <Card onClick={() => createRoom()}>
                            <PlusOutlined />
                        </Card>
                    </div>
                }
                </div>)
           : (<div>
               <AIGame></AIGame>
           </div>)}
           <Modal title={room.id} okText='开始游戏' closable={false} footer={false} visible={isModalVisible}>
             {gameResult.map((item,index) => (<div key={index}>
                {
                    ruleReflect[item] || item
                }
             </div>))}
             <div>
                    { room.count === 2 ? <Button type="primary" onClick={() => startGameServer() }>开始游戏</Button> : ''}
                    <Button type="dashed" onClick={handleCancel}>离开房间</Button>
             </div>
           </Modal>
    </div>
    )
};

export default Game