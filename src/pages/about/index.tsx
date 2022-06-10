import React from 'react'
import { updateAge, updateAsyncBook } from '../../store/about'
import { Book } from '../../libs/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
const About = () => {
  const appDistpatch = useAppDispatch()
  const { age, name, book } = useAppSelector((state) => state.aboutStore)
  return (
    <div>
      About
      <div>12312</div>
      <div>名称：{name}</div>
      <div>年龄: {age}</div>
      <button onClick={() => appDistpatch(updateAge(100))}>修改年龄</button>
      <button onClick={() => appDistpatch(updateAsyncBook())}>查询books</button>
      <div>
        {book.length > 0 &&
          book.map((item: Book) => {
            return (
              <div key={item.id}>
                <div>书名 {item.id}</div>
                <div>书名 {item.origin}</div>
                <div>书名 {item.tag}</div>
                <div>书名 {item.content}</div>
                <div>书名 {item.datetime}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default About
