/*
|--------------------------------------------------------------------------
| Import Section
|--------------------------------------------------------------------------
| List of all variables used inside by the component
|
*/
import * as React from "react";

type Props = {
  title?: string;
  otherDetails?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
};

export default function Heading({
  title,
  otherDetails,
  description,
  action,
}: Props) {
  /*
    |--------------------------------------------------------------------------
    | Data Section
    |--------------------------------------------------------------------------
    | List of all variables used inside the component
    |
    */

  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */

  /*
    |--------------------------------------------------------------------------
    | Hooks Section
    |--------------------------------------------------------------------------
    | List of all hooks action used  inside  the component
    |
    */

  return (
    <div data-aos="fade-down" data-aos-delay="50">
      <div className="sm:flex sm:justify-between sm:mb-14 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-dark-primary text-[28px] not-italic font-bold leading-[117.217%]">
              {title}
            </h1>
            {otherDetails}
          </div>
          <p className="text-black text-base font-normal leading-normal">
            {description}
          </p>
        </div>

        {action && <div className="mt-8 sm:mt-0">{action}</div>}
      </div>
    </div>
  );
}
