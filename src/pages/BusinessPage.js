import React from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';

import { connectToStores } from 'fluxible/addons';

class BusinessPage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>{this.props.business.name}</h1>
            <nav>
                <ul>
                    <li>
                        <Link route="business_pictures" params={{businessId: this.props.businessId}}>
                            Photos
                        </Link>
                    </li>
                    <li>
                        <Link route="business_members" params={{businessId: this.props.businessId}}>
                            Equipe
                        </Link>
                    </li>
                    <li>
                        <Link route="business_infos" params={{businessId: this.props.businessId}}>
                            Infos
                        </Link>
                    </li>
                    <li>
                        <Link route="business_map" params={{businessId: this.props.businessId}}>
                            Adresse & GPS
                        </Link>
                    </li>
                    <li>
                        <Link route="business_timetable" params={{businessId: this.props.businessId}}>
                            Horaires
                        </Link>
                    </li>
                </ul>
            </nav>
        </Layout>
    );
  }

}

BusinessPage = connectToStores(BusinessPage, [
    'BusinessStore'
], (stores, props) => ({
    business: stores.BusinessStore.getById(props.businessId)
}));

export default BusinessPage;
