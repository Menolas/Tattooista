import React from "react";
import {useParams} from "react-router-dom";

export const withRouter = (Children) => {
  const ComponentWithRouter = (props) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };

  ComponentWithRouter.displayName = `WithRouter(${Children.displayName || Children.name || 'Component'})`;

  return ComponentWithRouter;
};

withRouter.displayName = "withRouter";
