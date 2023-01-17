import React ,{useContext}from 'react'
import {useTranslation} from 'react-i18next'
import { Link } from 'react-router-dom';
import UserContext from '../../ContextHandler'

function ClaimesDashbord(props) {
    const [ t, i18n ] = useTranslation()
    const {user, setUser} = useContext(UserContext);

    let link = "/home/ReclamationList"
    if (user?.role == 0){
      link = "/Admin/ReclamationList"
    }


  return (
    <div>
        
        <div className="card">
  <div className="card-header border-transparent">
    <h3 className="card-title">{t("Derniers Reclamation")}</h3>
    <div className="card-tools">
    {props.messagesClos?
      <span className="badge badge-danger"> {props.messagesClos} Reclamation Non lu</span>
      : null
    }
    </div>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table m-0">
        <thead>
          <tr>
          <th>{t("Type")}</th>
          <th>{t("Utilisateur")}</th>
          <th>{t("Date")}</th>
          <th>{t("Etat")}</th>
          </tr>
        </thead>
        <tbody>
          {props.messages?
            props.messages.map((post) => (
                <tr key={post.id} >
                  <td>{post.type}</td>
                  <td>{post.source}</td>
                  <td>{post.date}</td>
                  <td>{!post.etat?
                    <div className="card-tools"> <span className="badge badge-danger">Clos</span></div>
                  :
                    <div className="card-tools"> <span className="badge badge-secondary">Ouvert</span></div> }
                  </td>
                </tr>
            ))
          : null
          } 

        </tbody>


      </table>
    </div>
  </div>
  <div className="card-footer clearfix">
{/*    <a href="javascript:void(0)" className="btn btn-sm btn-success float-left">{t("Crée un hotel")}</a>*/}
    <Link to={link} className="small-box-footer">
      <a  className="btn btn-sm btn-secondary float-right">
        Plus d'information  &nbsp;
        <i className="fas fa-arrow-circle-right" />
      </a>
    </Link>
  </div>
</div>

    </div>
  )
}

export default ClaimesDashbord