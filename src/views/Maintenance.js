// ** Reactstrap Imports
import { Button, Form, Input, Row, Col } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Styles
import '@styles/base/pages/page-misc.scss'

const Maintenance = (props) => {
  // ** Hooks
  const { skin } = useSkin()

  const { message } = props;

  const illustration = skin === 'dark' ? 'under-maintenance-dark.svg' : 'under-maintenance.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img height={28} src={themeConfig.app.appLogoImage} alt="logo" />
        <h2 className="brand-text text-primary ms-1">CallCloud</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Under Maintenance 🛠</h2>
          <p className='mb-1'>{ message ? message : "Sorry for the inconvenience but we're performing some maintenance at the moment" }</p>
          <img className='img-fluid' src={source} alt='Under maintenance page' />
        </div>
      </div>
    </div>
  )
}
export default Maintenance
