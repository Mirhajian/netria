local M = {}

local config = require('netria.config')
local state = require('netria.state')
local ui = require('netria.ui')
local banner = require('netria.banner')
local netrw = require('netria.netrw')

function M.setup()
  -- Track netrw buffers to properly apply settings
  vim.api.nvim_create_autocmd("FileType", {
    pattern = "netrw",
    callback = function(ev)
      -- Add to our tracked buffers if not already there
      if not vim.tbl_contains(state.netrw_bufs, ev.buf) then
        table.insert(state.netrw_bufs, ev.buf)
      end
      
      -- Always apply window settings when a netrw buffer becomes active
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        ui.apply_window_settings(state.win_id)
        
        -- Update our current buffer tracking
        if vim.api.nvim_get_current_win() == state.win_id then
          state.buf_id = ev.buf
          
          -- Update current directory state
          vim.defer_fn(function()
            state.current_dir = state.get_netrw_directory()
          end, 10)
          
          -- Add banner if not already added
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(ev.buf) then
              banner.add_custom_banner(ev.buf, state.win_id)
            end
          end, 50)
        end
      end
    end
  })
  
  -- Handle directory changes within netrw
  vim.api.nvim_create_autocmd("BufEnter", {
    callback = function(ev)
      -- If this is one of our netrw buffers and we're in our explorer window
      if state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        -- Update current directory state
        vim.defer_fn(function()
          state.current_dir = state.get_netrw_directory()
        end, 10)
        
        -- Key fix: Always re-add banner when entering a netrw buffer in our window
        vim.defer_fn(function()
          if vim.api.nvim_buf_is_valid(ev.buf) then
            banner.add_custom_banner(ev.buf, state.win_id)
          end
        end, 30)
      end
    end
  })
  
  -- Handle when a non-netrw buffer is entered
  vim.api.nvim_create_autocmd("BufEnter", {
    callback = function(ev)
      -- Defer the check to allow filetype to be set
      vim.schedule(function()
        -- If we entered a non-netrw buffer and our explorer window is still open
        if not state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
          -- Store this as the last opened file buffer
          state.last_opened_file = ev.buf
          
          -- Update current directory to the directory of the opened file
          local file_path = vim.api.nvim_buf_get_name(ev.buf)
          if file_path and file_path ~= "" then
            state.current_dir = vim.fn.fnamemodify(file_path, ":h")
          end
          
          -- Close the explorer window
          vim.api.nvim_win_close(state.win_id, true)
          state.win_id = nil
          
          -- Ensure we're focused on the new buffer
          local win_list = vim.api.nvim_list_wins()
          if #win_list > 0 then
            vim.api.nvim_set_current_win(win_list[1])
            vim.api.nvim_set_current_buf(ev.buf)
            
            -- Apply number settings to the file buffer window if configured
            if config.values.apply_numbers_to_files then
              if config.values.show_line_numbers then
                vim.wo[win_list[1]].number = true
              end
              
              if config.values.show_relative_numbers then
                vim.wo[win_list[1]].relativenumber = true
              end
            end
          end
        end
      end)
    end
  }) 

  -- Special handling for quitting when nothing is left
  vim.api.nvim_create_autocmd("BufLeave", {
    callback = function(ev)
      -- If we're leaving a netrw buffer in our explorer and it was started with a directory
      if state.is_netrw_buffer(ev.buf) and state.started_with_dir then
        -- Schedule a check to see if we should exit
        vim.schedule(function()
          -- If our explorer window is being closed and there are no real file buffers
          if state.win_id and not vim.api.nvim_win_is_valid(state.win_id) and state.count_real_buffers() == 0 then
            -- Try to quit Vim entirely
            vim.cmd("qa")
          end
        end)
      end
    end
  })
  
  -- Handle WinClosed for the explorer window
  vim.api.nvim_create_autocmd("WinClosed", {
    callback = function(ev)
      -- If our explorer window is closed and we started with a directory
      if tonumber(ev.match) == state.win_id and state.started_with_dir then
        -- Check if there are no real file buffers open
        if state.count_real_buffers() == 0 then
          -- Try to quit Vim entirely
          vim.schedule(function()
            vim.cmd("qa")
          end)
        end
      end
    end
  })
  
  -- Apply line numbers to new windows that open with file buffers
  vim.api.nvim_create_autocmd("WinNew", {
    callback = function()
      vim.schedule(function()
        local current_win = vim.api.nvim_get_current_win()
        local current_buf = vim.api.nvim_win_get_buf(current_win)
        
        -- If this is not a netrw buffer and we want to apply number settings to files
        if not state.is_netrw_buffer(current_buf) and config.values.apply_numbers_to_files then
          if config.values.show_line_numbers then
            vim.wo[current_win].number = true
          end
          
          if config.values.show_relative_numbers then
            vim.wo[current_win].relativenumber = true
          end
        end
      end)
    end
  })
  
  -- Ensure numbers are applied when buffer is displayed in a window
  vim.api.nvim_create_autocmd("BufWinEnter", {
    callback = function(ev)
      -- Apply to file buffers but not to netrw buffers
      if not state.is_netrw_buffer(ev.buf) and config.values.apply_numbers_to_files then
        for _, win_id in ipairs(vim.fn.win_findbuf(ev.buf)) do
          if config.values.show_line_numbers then
            vim.wo[win_id].number = true
          end
          
          if config.values.show_relative_numbers then
            vim.wo[win_id].relativenumber = true
          end
        end
      end
    end
  })
  
  -- Clean up when buffers are deleted
  vim.api.nvim_create_autocmd("BufDelete", {
    callback = function(ev)
      -- Remove from our tracking if it was a netrw buffer
      for i, buf_id in ipairs(state.netrw_bufs) do
        if buf_id == ev.buf then
          table.remove(state.netrw_bufs, i)
          break
        end
      end
      
      -- Also remove from banner tracking
      state.banner_buffers[ev.buf] = nil
    end
  })
  
  -- Handle VimLeavePre to clean up
  vim.api.nvim_create_autocmd("VimLeavePre", {
    callback = function()
      -- Clean up all tracked netrw buffers
      for _, buf_id in ipairs(state.netrw_bufs) do
        if vim.api.nvim_buf_is_valid(buf_id) then
          vim.api.nvim_buf_delete(buf_id, { force = true })
        end
      end
      state.netrw_bufs = {}
      state.banner_buffers = {}
    end
  })
  
  -- Intercept QuitPre to detect quitting from our explorer
  vim.api.nvim_create_autocmd("QuitPre", {
    callback = function()
      -- If we started with a directory and we're in our explorer
      if state.started_with_dir and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local current_win = vim.api.nvim_get_current_win()
        
        -- If quitting from our explorer window and no real files open
        if current_win == state.win_id and state.count_real_buffers() == 0 then
          -- Don't just close window, quit Vim entirely
          vim.schedule(function()
            vim.cmd("qa")
          end)
        end
      end
    end
  })

  -- Banner-related event for scroll events
  vim.api.nvim_create_autocmd("WinScrolled", {
    callback = function()
      -- Check if we're in our explorer with a banner
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf_id = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf_id) and config.values.banner.enabled and #config.values.banner.art > 0 then
          -- Create signs for each banner line to visually hide line numbers
          for i = 1, #config.values.banner.art do
            vim.fn.sign_define("BannerLine" .. i, { text = " ", texthl = "LineNr" })
            vim.fn.sign_place(i, "BannerSigns", "BannerLine" .. i, buf_id, { lnum = i })
          end
        end
      end
    end
  })

  -- Handle netrw content changes to ensure the banner stays
  vim.api.nvim_create_autocmd({"BufWritePost", "TextChanged", "TextChangedI"}, {
    pattern = "*",
    callback = function(ev)
      if not state.is_netrw_buffer(ev.buf) then 
        return 
      end
      
      -- Check if current buffer is a netrw buffer in our explorer
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) and 
         vim.api.nvim_win_get_buf(state.win_id) == ev.buf then
        
        -- Re-add banner with a small delay
        vim.defer_fn(function()
          if vim.api.nvim_buf_is_valid(ev.buf) then
            banner.add_custom_banner(ev.buf, state.win_id)
          end
        end, 30)
      end
    end
  })

  -- Update current directory and re-add banner when directory changes
  vim.api.nvim_create_autocmd("DirChanged", {
    callback = function()
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf) then
          -- Update current directory
          state.current_dir = vim.fn.getcwd()
          
          -- Re-add banner with a small delay
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(buf) then
              banner.add_custom_banner(buf, state.win_id)
            end
          end, 50)
        end
      end
    end
  })
  
  -- Critical: Add autocmd for NetrwRefresh to ensure banner persists
  vim.api.nvim_create_autocmd("User", {
    pattern = "NetrwRefresh",
    callback = function()
      if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        local buf = vim.api.nvim_win_get_buf(state.win_id)
        if state.is_netrw_buffer(buf) then
          vim.defer_fn(function()
            if vim.api.nvim_buf_is_valid(buf) then
              banner.add_custom_banner(buf, state.win_id)
            end
          end, 30)
        end
      end
    end
  })
  
  -- Add autocmd for Buffer listing changes to refresh our explorer
  vim.api.nvim_create_autocmd("BufHidden", {
    pattern = "*",
    callback = function(ev)
      -- If a buffer that affects our explorer is hidden
      if state.is_netrw_buffer(ev.buf) and state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
        vim.schedule(function()
          local current_buf = vim.api.nvim_win_get_buf(state.win_id)
          if state.is_netrw_buffer(current_buf) then
            banner.add_custom_banner(current_buf, state.win_id)
          end
        end)
      end
    end
  })
end

return M
