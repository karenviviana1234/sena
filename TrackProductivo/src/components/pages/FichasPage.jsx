import RegistroFicha from '../organisms/Ficha/RegisterFichas'
import TableFichas from '../organisms/Ficha/TableFicha'
//import Filter from '../organisms/Ficha/filtroFicha';
function FichasPage() {
  //const [filterValue, setFilterValue] = React.useState("");
  return (
    <>
    <main className='w-full p-3'>
        {/* <Filter filterValue={filterValue} setFilterValue={setFilterValue} /> */}
      <RegistroFicha/>
      <TableFichas/>
      </main>
   </>
  )
}

export default FichasPage