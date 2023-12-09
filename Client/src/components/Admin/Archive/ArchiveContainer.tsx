import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

export const ArchiveContainer: React.FC = () => {
    return (
        <div className={"archive"}>
            <header className={"archive__header"}>
                <nav className={"breadcrumbs"}>
                    <ul className={"list"}>
                        <li>
                            <NavLink
                                className={({isActive}) =>(isActive ? 'btn btn--sm btn--light-bg active' : 'btn btn--sm btn--dark-bg')}
                                to={'archivedConsultations'}
                            >
                                ArchivedConsultations
                            </NavLink>

                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>(isActive ? 'btn btn--sm btn--light-bg active' : 'btn btn--sm btn--dark-bg')}
                                to={'archivedClients'}
                            >
                                ArchivedClients
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({isActive}) =>(isActive ? 'btn btn--sm btn--light-bg active' : 'btn btn--sm btn--dark-bg')}
                                to={'archivedGallery'}
                            >
                                ArchivedGalleryItems
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <Outlet/>
        </div>
    )
}
