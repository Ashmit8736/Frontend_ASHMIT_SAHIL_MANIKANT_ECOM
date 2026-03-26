import React, { useState } from 'react'

const SearchBar = () => {
    const [serach,setSearch] = useState('')
  return (
    <div>
        <input type="text" onChange={(e)=>setSearch(e.target.value)}/>
    </div>
  )
}

export default SearchBar