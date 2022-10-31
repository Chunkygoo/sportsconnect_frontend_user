import React, { Fragment, useEffect, useRef } from 'react';
import autosize from 'autosize';
import { TrashIcon } from '@heroicons/react/solid';
import { DebounceInput } from 'react-debounce-input';
import useTranslation from 'next-translate/useTranslation';
import YearMonthDayPicker from '../DatePicker/YearMonthDayPicker';

export default function ItemRow({
  isDisabled,
  itemRowObject,
  handleUpdate,
  handleDelete,
  isCreateLoading,
}) {
  const { t } = useTranslation();
  const textareaRef = useRef(null);
  useEffect(() => {
    autosize(textareaRef.current);
  }, []);

  return (
    <Fragment>
      <li>
        <div className="flex justify-between text-blue-600">
          <DebounceInput
            disabled={isDisabled}
            debounceTimeout={1000}
            label="description"
            type="text"
            inputRef={textareaRef}
            element="textarea"
            rows="1"
            placeholder={t('portfolio:add_a_description')}
            value={itemRowObject.description}
            onChange={(e) =>
              handleUpdate({ ...itemRowObject, description: e.target.value })
            }
            className="pt-3 pb-2  w-full px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
          />
          {!isDisabled && (
            <span className="pt-4 pb-2 mr-4 border-0 focus:outline-none focus:ring-0 focus:border-black border-gray-200">
              <TrashIcon
                className="h-5 w-5 hover:cursor-pointer text-red-500"
                onClick={() => {
                  handleDelete(itemRowObject.id);
                }}
              />
            </span>
          )}
        </div>
        <div className="text-gray-500 text-xs flex justify-between">
          <div className="flex">
            <YearMonthDayPicker
              isDisabled={isDisabled}
              selected={itemRowObject.startDate}
              onChange={(date) => {
                handleUpdate({ ...itemRowObject, startDate: date });
              }}
              className="border-0 p-0 max-w-[4rem] text-xs border-gray-200 m-0 
                          hover:cursor-pointer focus:outline-none focus:ring-0 focus:border-black"
              wrapperClassName="max-w-[4.2rem] mr-1"
            />{' '}
            to{' '}
            {itemRowObject.active ? (
              <span className="ml-2">present</span>
            ) : (
              <YearMonthDayPicker
                isDisabled={isDisabled}
                selected={itemRowObject.endDate}
                onChange={(date) => {
                  handleUpdate({ ...itemRowObject, endDate: date });
                }}
                className="border-0 p-0 max-w-[4rem] text-xs border-gray-200 m-0
                          hover:cursor-pointer focus:outline-none focus:ring-0 focus:border-black"
                wrapperClassName="max-w-[4.2rem] ml-2"
              />
            )}
          </div>
          {itemRowObject.active ? (
            <div
              className="mr-10 hover:cursor-pointer"
              onClick={() => {
                if (isDisabled) return;
                handleUpdate({
                  ...itemRowObject,
                  active: !itemRowObject.active,
                });
              }}
            >
              {t('portfolio:active')}
            </div>
          ) : (
            <div
              className="mr-8 hover:cursor-pointer"
              onClick={() => {
                if (isDisabled) return;
                handleUpdate({
                  ...itemRowObject,
                  active: !itemRowObject.active,
                });
              }}
            >
              {t('portfolio:inactive')}
            </div>
          )}
        </div>
      </li>
    </Fragment>
  );
}
