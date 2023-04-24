1. Take Pull from architecture branch.  (Latest branch - architecture)

2. Add Host URL in following file.
   - Open src -> constants -> APIConstants.js.
   - Change 'host' constant with new Host name.
   - Change 'BASE_API_URL' constant with new path. (i.e Host name / API folder )

3. Add Image URL in following file.
   - Open File - src -> constants -> APIConstants.js.
   - Change 'BASE_IMAGE_URL' with new image path.

4. Change in API URL of Each Module.
   - If you want to change base api url path of each module, then open following file,
     File - src -> constants -> APIConstants.js.
   - Please check existing API path and change accordingly.

5. Change in Redirection link or path name.
   - Open file - src -> constants -> MenuLinkConstants.js.
   - Change redirection in respective module.
    ( Note : Please co-ordinate with backend developer while changing link, because these link also in relation with access level table)

6. Change in Menu List ( Labels and Sequence )
  - Open file - src -> data -> _menu.js.
  - Change labels and Sequence as per your requirement.

7. Change in Messages. (In Manage Module of Add, Update, Delete and others )
   - Open File - src -> constants -> MsgConstants.js.
   - Please read message carefully and their key. Then change message according.

8. Change in Manage Module Labels.
   - Open File - src -> constants -> WebConstants.js.
   - Change Labels according to key or constant.

9. Change in Dashboard Chart Configuration.
   - Open File - src -> constants -> WebConstants.js.
   - And change const - 'CHART_OPTIONS' with appropriate values.

10. Change in Chart Color.
    - Open File - src -> constants -> WebConstants.js.
    - And change const - 'CHART_BAR_COLOR' with new color code.

