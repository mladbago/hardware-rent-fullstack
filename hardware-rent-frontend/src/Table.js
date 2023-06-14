import AuthService from "./services/auth.service";

export default function Table({theadData, tbodyData, onDelete, onAddToCart})
{
  const user = AuthService.getCurrentUser();
  const isAdmin = user.authorities.some(authority => authority.authority === 'ROLE_ADMIN')

  if (theadData && tbodyData && theadData.length > 0 && tbodyData.length>0)
    return (

    <table className="table table-striped">
      <thead>
        <tr>
          {theadData.map(heading => {return <th key={heading}>{heading}</th>})}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((row, index) =>
        {
          return <tr key={index}>
            {theadData.map((key, index) =>
            {
              return <td key={index}>{JSON.stringify(row[key])}</td>
            })}
            {onAddToCart &&
              <td className="text-end"><button className="bi bi-plus-square border-0 bg-transparent " onClick={()=>{onAddToCart(row.id, 1)}}/></td>}
            {onDelete && isAdmin &&
              <td className="text-end"><button className="bi bi-trash border-0 bg-transparent" onClick={()=>{onDelete(row.id)}}/></td>}
          </tr>;
        })}
      </tbody>
    </table>
  );
}