local M = {}

local config = require('netria.config')
local state = require('netria.state')
-- Removed ui requirement to break circular dependency

function M.add_custom_banner(buf_id, win_id)
  -- Existing initial checks --------------------------------------------------
  if not config.values.banner.enabled or not config.values.banner.art or #config.values.banner.art == 0 then
    return
  end

  if not win_id or not vim.api.nvim_win_is_valid(win_id) then
    return
  end

  -- Prevent re-entrancy ------------------------------------------------------
  if state.adding_banner then
    return
  end
  state.adding_banner = true

  -- Wrap all banner logic in pcall -------------------------------------------
  local ok, err = pcall(function()
    -- Existing banner generation logic ---------------------------------------
    local available_width = vim.api.nvim_win_get_width(win_id)
    if config.values.border then
      available_width = available_width - 2
    end

    local centered_banner = {}
    for _, line in ipairs(config.values.banner.art) do
      local line_length = vim.fn.strdisplaywidth(line)
      local padding = math.max(0, math.floor((available_width - line_length) / 2))
      table.insert(centered_banner, string.rep(' ', padding) .. line)
    end

    -- Existing buffer content checks -----------------------------------------
    local current_lines = vim.api.nvim_buf_get_lines(buf_id, 0, -1, false)
    local has_banner = false

    if #current_lines >= #centered_banner then
      has_banner = true
      for i, line in ipairs(centered_banner) do
        if current_lines[i] ~= line then
          has_banner = false
          break
        end
      end
    end

    -- Buffer modification logic ----------------------------------------------
    if not has_banner then
      -- Add buffer validity check
      if not vim.api.nvim_buf_is_valid(buf_id) then
        return
      end

      local was_modifiable = vim.bo[buf_id].modifiable
      local was_readonly = vim.bo[buf_id].readonly
      
      vim.bo[buf_id].modifiable = true
      vim.bo[buf_id].readonly = false

      local new_lines = vim.list_extend(vim.deepcopy(centered_banner), current_lines)
      vim.api.nvim_buf_set_lines(buf_id, 0, -1, false, new_lines)
      vim.bo[buf_id].modified = false

      vim.bo[buf_id].modifiable = was_modifiable
      vim.bo[buf_id].readonly = was_readonly

      -- Modified cursor positioning with validation --------------------------
      if #centered_banner > 0 then
        local target_line = #centered_banner + 1
        local line_count = vim.api.nvim_buf_line_count(buf_id)
        
        if target_line <= line_count then
          vim.api.nvim_win_set_cursor(win_id, {target_line, 0})
        end
      end

      state.banner_buffers[buf_id] = true
    end
  end) -- End of pcall wrapper

  -- Always reset the flag ----------------------------------------------------
  state.adding_banner = false

  -- Error handling -----------------------------------------------------------
  if not ok then
    vim.notify("Banner Error: " .. tostring(err), vim.log.levels.ERROR)
    -- Optional: Add recovery logic here
  end
end

-- Create signs for banner lines to visually hide line numbers
function M.create_banner_signs(buf_id)
  if config.values.banner.enabled and #config.values.banner.art > 0 then
    for i = 1, #config.values.banner.art do
      vim.fn.sign_define("BannerLine" .. i, { text = " ", texthl = "LineNr" })
      vim.fn.sign_place(i, "BannerSigns", "BannerLine" .. i, buf_id, { lnum = i })
    end
  end
end

return M
