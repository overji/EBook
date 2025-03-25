import {Image,Row,Col} from 'antd'
import {getBookWithId} from "../services/getBooks";
import {useEffect, useState} from "react";

export default function BookIntro({bookId})
{
    const [bookInfo,setBookInfo] = useState(null);
    useEffect(()=>{
        getBookWithId(bookId)
            .then(res=>{
                setBookInfo(res);
                console.log(`Book ${bookId} info: ${JSON.stringify(res)}`);
            })
    },[bookId])
    return(
        <div>
            nihao,{JSON.stringify(bookInfo)}
        </div>
    )
}