import React, { Fragment, useEffect, useRef, useState } from 'react';
import autosize from 'autosize';
import yyyymmdd from '../../utilities/yyyymmdd';
import { TrashIcon } from '@heroicons/react/solid';
import { DebounceInput } from 'react-debounce-input';
import useTranslation from 'next-translate/useTranslation';
import { deleteEducation, updateEducation } from '../../network/lib/education';
import {
  deleteExperience,
  updateExperience,
} from '../../network/lib/experience';
import YearMonthDayPicker from '../DatePicker/YearMonthDayPicker';

Date.prototype.yyyymmdd = yyyymmdd;

export default function ItemRow({
  description,
  startDate,
  endDate,
  active,
  id,
  index,
  removeItem,
  endpoint,
  isDisabled,
}) {
  const { t } = useTranslation();
  let [currentActive, setCurrentActive] = useState(active);
  let [currentDescription, setCurrentDescription] = useState(description);
  let [currentStartDate, setCurrentStartDate] = useState(startDate);
  let [currentEndDate, setCurrentEndDate] = useState(endDate);
  const firstRun = useRef(true);
  const textareaRef = useRef(null);

  let handleDelete = async () => {
    if (endpoint === '/educations') {
      await deleteEducation(id);
    } else {
      await deleteExperience(id);
    }
  };

  useEffect(() => {
    let handleUpdate = async () => {
      let updateObject = {
        description: currentDescription,
        active: currentActive,
        start_date: currentStartDate.yyyymmdd(),
        end_date: null,
      };
      if (currentEndDate !== undefined) {
        updateObject.end_date = currentEndDate.yyyymmdd();
      }
      if (endpoint === '/educations') {
        await updateEducation(id, updateObject);
      } else {
        await updateExperience(id, updateObject);
      }
    };

    // we do not want to update on mount
    if (firstRun.current) {
      firstRun.current = false;
    } else {
      handleUpdate();
    }
  }, [
    currentDescription,
    currentActive,
    currentStartDate,
    currentEndDate,
    endpoint,
    id,
  ]);

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
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            className="pt-3 pb-2  w-full px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
          />
          {!isDisabled && (
            <span className="pt-4 pb-2 mr-4 border-0 focus:outline-none focus:ring-0 focus:border-black border-gray-200">
              <TrashIcon
                className="h-5 w-5 hover:cursor-pointer text-red-500"
                onClick={() => {
                  removeItem(index);
                  handleDelete();
                }}
              />
            </span>
          )}
        </div>
        <div className="text-gray-500 text-xs flex justify-between">
          <div className="flex">
            <YearMonthDayPicker
              isDisabled={isDisabled}
              selected={currentStartDate}
              onChange={(date) => {
                setCurrentStartDate(date);
              }}
              className="border-0 p-0 max-w-[4rem] text-xs border-gray-200 m-0 
                          hover:cursor-pointer focus:outline-none focus:ring-0 focus:border-black"
              wrapperClassName="max-w-[4.2rem] mr-1"
            />{' '}
            to{' '}
            {currentActive ? (
              <span className="ml-2">present</span>
            ) : (
              <YearMonthDayPicker
                isDisabled={isDisabled}
                selected={currentEndDate}
                onChange={(date) => {
                  setCurrentEndDate(date);
                }}
                className="border-0 p-0 max-w-[4rem] text-xs border-gray-200 m-0
                          hover:cursor-pointer focus:outline-none focus:ring-0 focus:border-black"
                wrapperClassName="max-w-[4.2rem] ml-2"
              />
            )}
          </div>
          {currentActive ? (
            <div
              className="mr-10 hover:cursor-pointer"
              onClick={() => {
                if (isDisabled) return;
                setCurrentActive(!currentActive);
              }}
            >
              {t('portfolio:active')}
            </div>
          ) : (
            <div
              className="mr-8 hover:cursor-pointer"
              onClick={() => {
                if (isDisabled) return;
                setCurrentActive(!currentActive);
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
